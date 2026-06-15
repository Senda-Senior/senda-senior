-- 0004_remodel_context_vault.sql
-- Remodelagem lógica — profiles, care_checklist_items, vault refatorado, remove old tables
-- Tabelas: public.profiles, public.care_checklist_items, public.vault_* (recriadas)
-- Conecta: base do modelo atual; referenciada por todas as queries de vault em features/vault/data.ts
-- Camada: dados (migration Supabase, aplicada — nunca editar)

-- ─── 0004_remodel_context_vault ─────────────────────────────────────
-- remodelagem lógica: profiles, care_*, categorias sistema vs. usuário,
-- vault_files (documento) + vault_file_blobs (mídia). remove
-- classificação isolada, audit, shares, access_log, user_checklist.
--
-- idempotente em ambiente de dev: drop + recria. aceita perda de dados
-- de demo. em produção: aplicar com backup/CI consciente.
-- ─── pré-requisitos ════════════════════════════════════════════════
create extension if not exists pgcrypto;
create extension if not exists unaccent;

-- ═══ 1) desmontar o que 0001/0002/0003 criaram ═════════════════════
drop trigger if exists vault_init_quota_after_signup on auth.users;
drop trigger if exists touch_user_checklist_items on public.user_checklist_items;
drop table if exists public.vault_file_tags cascade;
drop table if exists public.vault_classification_results cascade;
drop table if exists public.vault_access_log cascade;
drop table if exists public.vault_shares cascade;
drop table if exists public.vault_file_versions cascade;
drop table if exists public.vault_files cascade;
drop table if exists public.vault_file_blobs cascade;
drop table if exists public.vault_tags cascade;
drop table if exists public.vault_categories cascade;
drop table if exists public.vault_system_categories cascade;
drop table if exists public.vault_quotas cascade;
drop table if exists public.profiles cascade;
drop table if exists public.care_checklist_items cascade;
drop table if exists public.user_checklist_items cascade;

drop function if exists public.vault_init_quota_for_user() cascade;
drop function if exists public.vault_files_quota_trigger() cascade;
drop function if exists public.vault_quotas_recalc(uuid) cascade;
drop function if exists public.vault_files_update_search() cascade;

-- set_updated_at pode existir de 0002 — recriaremos
drop function if exists public.set_updated_at() cascade;
drop function if exists public.touch_updated_at() cascade;


-- ═══ 2) profiles (identidade) ═══════════════════════════════════════
create table if not exists public.profiles (
  user_id     uuid        primary key references auth.users(id) on delete cascade,
  display_name text,
  care_role   text        check (care_role is null or care_role in ('self', 'caregiver')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
drop policy if exists "profiles_self_all" on public.profiles;
create policy "profiles_self_all"
  on public.profiles for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ═══ 3) care_checklist_items (ex-user_checklist_items) ═══════════
create table if not exists public.care_checklist_items (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  item_key    text        not null,
  done        boolean     not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, item_key)
);

drop trigger if exists care_checklist_items_updated_at on public.care_checklist_items;
create trigger care_checklist_items_updated_at
  before update on public.care_checklist_items
  for each row execute function public.set_updated_at();

alter table public.care_checklist_items enable row level security;
drop policy if exists "care_checklist_read_own" on public.care_checklist_items;
create policy "care_checklist_read_own"
  on public.care_checklist_items for select
  to authenticated
  using (user_id = auth.uid());
drop policy if exists "care_checklist_insert_own" on public.care_checklist_items;
create policy "care_checklist_insert_own"
  on public.care_checklist_items for insert
  to authenticated
  with check (user_id = auth.uid());
drop policy if exists "care_checklist_update_own" on public.care_checklist_items;
create policy "care_checklist_update_own"
  on public.care_checklist_items for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
drop policy if exists "care_checklist_delete_own" on public.care_checklist_items;
create policy "care_checklist_delete_own"
  on public.care_checklist_items for delete
  to authenticated
  using (user_id = auth.uid());


-- ═══ 4) vault — bucket storage ══════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vault', 'vault', false, 52428800, null)
on conflict (id) do nothing;

drop policy if exists "vault_storage_select_own" on storage.objects;
create policy "vault_storage_select_own"
  on storage.objects for select
  using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "vault_storage_insert_own" on storage.objects;
create policy "vault_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "vault_storage_update_own" on storage.objects;
create policy "vault_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "vault_storage_delete_own" on storage.objects;
create policy "vault_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ═══ 5) categorias do sistema (globais, pk = slug) ═══════════════
create table public.vault_system_categories (
  slug        text        primary key,
  label       text        not null,
  icon        text,
  color       text,
  sort_order  int         not null default 0
);

insert into public.vault_system_categories (slug, label, icon, color, sort_order) values
  ('juridico',   'Jurídico',    'Scale',       '#2D5F4F', 10),
  ('saude',      'Saúde',       'Heart',       '#B5724A', 20),
  ('financeiro', 'Financeiro',  'Wallet',      '#6B5B4E', 30),
  ('trabalho',   'Trabalho',    'Briefcase',   '#3F6E5A', 40),
  ('viagem',     'Viagem',      'Plane',       '#7A8B6F', 50),
  ('imoveis',    'Imóveis',     'Home',        '#8A6A50', 60),
  ('pessoal',    'Pessoal',     'User',        '#5B5045', 70),
  ('outros',     'Outros',      'Folder',      '#999999', 99)
on conflict (slug) do nothing;

alter table public.vault_system_categories enable row level security;
drop policy if exists "vault_system_categories_read" on public.vault_system_categories;
create policy "vault_system_categories_read"
  on public.vault_system_categories for select
  to authenticated
  using (true);


-- ═══ 6) categorias do usuário ═══════════════════════════════════════
create table public.vault_categories (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  slug        text        not null,
  label       text        not null,
  icon        text,
  color       text,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),

  unique (user_id, slug)
);

create index if not exists vault_categories_owner
  on public.vault_categories (user_id, sort_order);

alter table public.vault_categories enable row level security;
drop policy if exists "vault_categories_owner" on public.vault_categories;
create policy "vault_categories_owner"
  on public.vault_categories for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ═══ 7) tags ══════════════════════════════════════════════════════
create table public.vault_tags (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  slug        text        not null,
  label       text        not null,
  created_at  timestamptz not null default now(),

  unique (user_id, slug)
);

alter table public.vault_tags enable row level security;
drop policy if exists "vault_tags_owner" on public.vault_tags;
create policy "vault_tags_owner"
  on public.vault_tags for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ═══ 8) arquivos (lógica) e blobs (física) — ordem evita ciclos fk ═
create table public.vault_files (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references auth.users(id) on delete cascade,
  current_blob_id     uuid,

  display_name        text        not null check (length(display_name) between 1 and 255),
  original_name       text        not null,
  system_category_slug text      references public.vault_system_categories(slug) on delete set null,
  user_category_id    uuid        references public.vault_categories(id) on delete set null,
  manual_override     boolean     not null default false,
  confidence          numeric(3,2) check (confidence is null or (confidence >= 0 and confidence <= 1)),

  description         text        check (description is null or length(description) <= 2000),
  favorite            boolean     not null default false,
  is_private          boolean     not null default false,

  status              text        not null default 'pending'
                      check (status in ('pending', 'ready', 'failed')),

  text_content        text,
  search_vector       tsvector,

  version_count       int         not null default 0,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz,

  constraint vault_files_category_scope check (
    status in ('pending', 'failed')
    or (system_category_slug is not null and user_category_id is null)
    or (system_category_slug is null and user_category_id is not null)
  )
);

create table public.vault_file_blobs (
  id            uuid        primary key default gen_random_uuid(),
  file_id       uuid        not null references public.vault_files(id) on delete cascade,
  version       int         not null,
  storage_path  text        not null unique,
  mime_type     text        not null,
  extension     text        not null,
  size_bytes    bigint      not null check (size_bytes > 0),
  sha256        text        not null check (length(sha256) = 64),
  uploaded_at   timestamptz not null default now(),

  unique (file_id, version)
);

alter table public.vault_files
  add constraint vault_files_current_blob_fk
  foreign key (current_blob_id) references public.vault_file_blobs(id) on delete set null;

create index if not exists vault_files_owner_active
  on public.vault_files (user_id, deleted_at, created_at desc);

create index if not exists vault_files_owner_system_category
  on public.vault_files (user_id, system_category_slug)
  where deleted_at is null and user_category_id is null;

create index if not exists vault_files_search_gin
  on public.vault_files using gin (search_vector);

create index if not exists vault_files_pending_cleanup
  on public.vault_files (created_at)
  where status = 'pending';

alter table public.vault_files enable row level security;
drop policy if exists "vault_files_owner" on public.vault_files;
create policy "vault_files_owner"
  on public.vault_files for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ═══ 9) m:n arquivo ↔ tag ═════════════════════════════════════════
create table public.vault_file_tags (
  file_id  uuid    not null references public.vault_files(id) on delete cascade,
  tag_id   uuid    not null references public.vault_tags(id) on delete cascade,
  primary key (file_id, tag_id)
);

alter table public.vault_file_tags enable row level security;
drop policy if exists "vault_file_tags_owner" on public.vault_file_tags;
create policy "vault_file_tags_owner"
  on public.vault_file_tags for all
  to authenticated
  using (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_tags.file_id and f.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_tags.file_id and f.user_id = auth.uid())
  );


-- ═══ 10) quotas 1:1 usuário ═══════════════════════════════════════
create table public.vault_quotas (
  user_id      uuid    primary key references auth.users(id) on delete cascade,
  tier         text    not null default 'free'
                 check (tier in ('free', 'premium', 'enterprise')),
  limit_bytes  bigint  not null default 524288000,
  used_bytes   bigint  not null default 0,
  file_count   int     not null default 0,
  updated_at   timestamptz not null default now()
);

drop trigger if exists vault_quotas_updated_at on public.vault_quotas;
create trigger vault_quotas_updated_at
  before update on public.vault_quotas
  for each row execute function public.set_updated_at();

alter table public.vault_quotas enable row level security;
drop policy if exists "vault_quotas_owner_select" on public.vault_quotas;
create policy "vault_quotas_owner_select"
  on public.vault_quotas for select
  to authenticated
  using (user_id = auth.uid());


-- ═══ 11) versões: contagem ao mudar blobs ═══════════════════════
create or replace function public.vault_file_blobs_sync_version_count()
returns trigger
language plpgsql
as $$
declare
  fid uuid;
begin
  if tg_op = 'DELETE' then
    fid := old.file_id;
  else
    fid := new.file_id;
  end if;
  update public.vault_files
  set version_count = coalesce((
    select count(*)::int from public.vault_file_blobs where file_id = fid
  ), 0)
  where id = fid;
  return coalesce(new, old);
end;
$$;

drop trigger if exists vault_file_blobs_version_count on public.vault_file_blobs;
create trigger vault_file_blobs_version_count
  after insert or update or delete on public.vault_file_blobs
  for each row execute function public.vault_file_blobs_sync_version_count();


-- ═══ 12) rls em blobs (via ownership do ficheiro) ═══════════════
alter table public.vault_file_blobs enable row level security;
drop policy if exists "vault_file_blobs_owner" on public.vault_file_blobs;
create policy "vault_file_blobs_owner"
  on public.vault_file_blobs for all
  to authenticated
  using (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_blobs.file_id and f.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_blobs.file_id and f.user_id = auth.uid())
  );


-- ═══ 13) busca em texto completo (unchanged columns no file) ═════
create or replace function public.vault_files_update_search()
returns trigger
language plpgsql
set search_path = public, extensions, pg_temp
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('portuguese', extensions.unaccent(coalesce(new.display_name, ''))), 'A') ||
    setweight(to_tsvector('portuguese', extensions.unaccent(coalesce(new.description, ''))),  'B') ||
    setweight(to_tsvector('portuguese', extensions.unaccent(coalesce(new.text_content, ''))), 'C');
  return new;
end;
$$;

drop trigger if exists vault_files_search_vector on public.vault_files;
create trigger vault_files_search_vector
  before insert or update of display_name, description, text_content
  on public.vault_files
  for each row execute function public.vault_files_update_search();


-- ═══ 14) cota: soma dos blobs ativos dos ficheiros prontos ══════
create or replace function public.vault_quotas_recalc(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.vault_quotas (user_id) values (p_user_id)
  on conflict (user_id) do nothing;

  update public.vault_quotas
  set
    used_bytes = coalesce((
      select sum(b.size_bytes) from public.vault_files f
      join public.vault_file_blobs b on b.id = f.current_blob_id
      where f.user_id = p_user_id
        and f.status = 'ready'
        and f.deleted_at is null
    ), 0),
    file_count = coalesce((
      select count(*) from public.vault_files
      where user_id = p_user_id
        and status = 'ready'
        and deleted_at is null
    ), 0)
  where user_id = p_user_id;
end;
$$;

create or replace function public.vault_files_quota_trigger()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    perform public.vault_quotas_recalc(new.user_id);
  elsif (tg_op = 'UPDATE') then
    if (old.current_blob_id is distinct from new.current_blob_id
        or old.status is distinct from new.status
        or old.deleted_at is distinct from new.deleted_at) then
      perform public.vault_quotas_recalc(new.user_id);
    end if;
  elsif (tg_op = 'DELETE') then
    perform public.vault_quotas_recalc(old.user_id);
  end if;
  return null;
end;
$$;

drop trigger if exists vault_files_quota_after on public.vault_files;
create trigger vault_files_quota_after
  after insert or update or delete on public.vault_files
  for each row execute function public.vault_files_quota_trigger();

create or replace function public.vault_blobs_quota_trigger()
returns trigger
language plpgsql
as $$
declare
  uid uuid;
  fid uuid;
begin
  if (tg_op = 'DELETE') then
    fid := old.file_id;
  else
    fid := new.file_id;
  end if;
  select user_id into uid from public.vault_files where id = fid;
  if uid is not null then
    perform public.vault_quotas_recalc(uid);
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists vault_blobs_quota_after on public.vault_file_blobs;
create trigger vault_blobs_quota_after
  after insert or delete or update of size_bytes on public.vault_file_blobs
  for each row execute function public.vault_blobs_quota_trigger();


-- ═══ 15) novos users: profile + cota ════════════════════════════
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.vault_quotas (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ═══ 16) back-fill (users existentes) ═══════════════════════════
insert into public.profiles (user_id)
  select id from auth.users
  where id not in (select user_id from public.profiles)
on conflict (user_id) do nothing;

insert into public.vault_quotas (user_id)
  select id from auth.users
  where id not in (select user_id from public.vault_quotas)
on conflict (user_id) do nothing;


-- ═══ 17) triggers de updated_at em vault_files ══════════════════
drop trigger if exists vault_files_updated_at on public.vault_files;
create trigger vault_files_updated_at
  before update on public.vault_files
  for each row execute function public.set_updated_at();


-- ═══ reload schema cache ═══════════════════════════════════════
notify pgrst, 'reload schema';
