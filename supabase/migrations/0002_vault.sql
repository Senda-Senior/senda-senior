-- 0002_vault.sql
-- Cria cofre digital de documentos — storage bucket, categorias, tags, files, quotas, audit
-- Tabelas: public.vault_categories, public.vault_tags, public.vault_files, public.vault_file_versions, public.vault_quotas, public.vault_classification_results, public.vault_access_log, public.vault_shares

-- ─── 0002_vault ──────────────────────────────────────────────────────
-- cofre digital de documentos.
-- referência: docs/vault/model.md
--
-- idempotente: pode ser executada múltiplas vezes sem falhar.
-- ─────────────────────────────────────────────────────────────────────

-- ═══ pré-requisitos ═════════════════════════════════════════════════
create extension if not exists "pgcrypto";   -- gen_random_uuid
create extension if not exists "unaccent";   -- normalização para search


-- ═══ storage bucket ═════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vault', 'vault', false, 52428800, null)  -- 50 mb hard limit
on conflict (id) do nothing;

-- policies do storage: cada user só vê seu próprio prefixo
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


-- ═══ vault_categories ═══════════════════════════════════════════════
create table if not exists public.vault_categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  type        text not null check (type in ('system', 'user')),
  slug        text not null,
  label       text not null,
  icon        text,
  color       text,
  sort_order  int default 0,
  created_at  timestamptz default now(),

  constraint vault_categories_user_type_consistency
    check (
      (type = 'system' and user_id is null) or
      (type = 'user'   and user_id is not null)
    )
);

create unique index if not exists vault_categories_unique_slug
  on public.vault_categories (coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid), slug);

alter table public.vault_categories enable row level security;

drop policy if exists "vault_categories_select" on public.vault_categories;
create policy "vault_categories_select"
  on public.vault_categories for select
  using (type = 'system' or user_id = auth.uid());

drop policy if exists "vault_categories_insert_own" on public.vault_categories;
create policy "vault_categories_insert_own"
  on public.vault_categories for insert
  with check (type = 'user' and user_id = auth.uid());

drop policy if exists "vault_categories_update_own" on public.vault_categories;
create policy "vault_categories_update_own"
  on public.vault_categories for update
  using (type = 'user' and user_id = auth.uid())
  with check (type = 'user' and user_id = auth.uid());

drop policy if exists "vault_categories_delete_own" on public.vault_categories;
create policy "vault_categories_delete_own"
  on public.vault_categories for delete
  using (type = 'user' and user_id = auth.uid());

-- seed das categorias sistema
insert into public.vault_categories (type, slug, label, icon, color, sort_order) values
  ('system', 'juridico',   'Jurídico',    'Scale',       '#2D5F4F', 10),
  ('system', 'saude',      'Saúde',       'Heart',       '#B5724A', 20),
  ('system', 'financeiro', 'Financeiro',  'Wallet',      '#6B5B4E', 30),
  ('system', 'trabalho',   'Trabalho',    'Briefcase',   '#3F6E5A', 40),
  ('system', 'viagem',     'Viagem',      'Plane',       '#7A8B6F', 50),
  ('system', 'imoveis',    'Imóveis',     'Home',        '#8A6A50', 60),
  ('system', 'pessoal',    'Pessoal',     'User',        '#5B5045', 70),
  ('system', 'outros',     'Outros',      'Folder',      '#999999', 99)
on conflict do nothing;


-- ═══ vault_tags ═════════════════════════════════════════════════════
create table if not exists public.vault_tags (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  slug        text not null,
  label       text not null,
  created_at  timestamptz default now(),

  unique (user_id, slug)
);

alter table public.vault_tags enable row level security;

drop policy if exists "vault_tags_owner" on public.vault_tags;
create policy "vault_tags_owner"
  on public.vault_tags for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ═══ vault_files ════════════════════════════════════════════════════
create table if not exists public.vault_files (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,

  storage_path    text not null unique,
  display_name    text not null check (length(display_name) between 1 and 255),
  original_name   text not null,
  mime_type       text not null,
  extension       text not null,
  size_bytes      bigint not null check (size_bytes > 0),
  sha256          text not null check (length(sha256) = 64),

  category_id     uuid references public.vault_categories(id) on delete set null,
  manual_override boolean not null default false,
  confidence      numeric(3,2) check (confidence is null or (confidence >= 0 and confidence <= 1)),

  description     text check (description is null or length(description) <= 2000),
  favorite        boolean not null default false,
  is_private      boolean not null default false,

  status          text not null default 'pending'
                  check (status in ('pending', 'ready', 'failed')),

  text_content    text,
  search_vector   tsvector,

  version_count   int not null default 1,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz,

  unique (user_id, sha256)
);

create index if not exists vault_files_owner_active
  on public.vault_files (user_id, deleted_at, created_at desc);

create index if not exists vault_files_owner_category
  on public.vault_files (user_id, category_id)
  where deleted_at is null;

create index if not exists vault_files_search_gin
  on public.vault_files using gin (search_vector);

create index if not exists vault_files_pending_cleanup
  on public.vault_files (created_at)
  where status = 'pending';

alter table public.vault_files enable row level security;

drop policy if exists "vault_files_owner" on public.vault_files;
create policy "vault_files_owner"
  on public.vault_files for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ═══ vault_file_tags (m:n) ══════════════════════════════════════════
create table if not exists public.vault_file_tags (
  file_id  uuid not null references public.vault_files(id) on delete cascade,
  tag_id   uuid not null references public.vault_tags(id) on delete cascade,
  primary key (file_id, tag_id)
);

alter table public.vault_file_tags enable row level security;

drop policy if exists "vault_file_tags_owner" on public.vault_file_tags;
create policy "vault_file_tags_owner"
  on public.vault_file_tags for all
  using (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_tags.file_id and f.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_tags.file_id and f.user_id = auth.uid())
  );


-- ═══ vault_file_versions ════════════════════════════════════════════
create table if not exists public.vault_file_versions (
  id            uuid primary key default gen_random_uuid(),
  file_id       uuid not null references public.vault_files(id) on delete cascade,
  version       int not null,
  storage_path  text not null,
  size_bytes    bigint not null,
  sha256        text not null,
  is_current    boolean not null default false,
  uploaded_at   timestamptz not null default now(),

  unique (file_id, version)
);

create unique index if not exists vault_file_versions_one_current
  on public.vault_file_versions (file_id) where is_current;

alter table public.vault_file_versions enable row level security;

drop policy if exists "vault_file_versions_owner" on public.vault_file_versions;
create policy "vault_file_versions_owner"
  on public.vault_file_versions for all
  using (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_versions.file_id and f.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.vault_files f
            where f.id = vault_file_versions.file_id and f.user_id = auth.uid())
  );


-- ═══ vault_quotas ═══════════════════════════════════════════════════
create table if not exists public.vault_quotas (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  tier         text not null default 'free'
               check (tier in ('free', 'premium', 'enterprise')),
  limit_bytes  bigint not null default 524288000,
  used_bytes   bigint not null default 0,
  file_count   int    not null default 0,
  updated_at   timestamptz not null default now()
);

alter table public.vault_quotas enable row level security;

drop policy if exists "vault_quotas_owner_select" on public.vault_quotas;
create policy "vault_quotas_owner_select"
  on public.vault_quotas for select
  using (user_id = auth.uid());


-- ═══ vault_classification_results ══════════════════════════════════
create table if not exists public.vault_classification_results (
  id                       uuid primary key default gen_random_uuid(),
  file_id                  uuid not null references public.vault_files(id) on delete cascade,
  suggested_category_id    uuid references public.vault_categories(id),
  confidence               numeric(3,2),
  signals                  jsonb,
  accepted                 boolean,
  classified_at            timestamptz not null default now()
);

create index if not exists vault_classif_results_file
  on public.vault_classification_results (file_id);

alter table public.vault_classification_results enable row level security;

drop policy if exists "vault_classif_results_owner_select"
  on public.vault_classification_results;
create policy "vault_classif_results_owner_select"
  on public.vault_classification_results for select
  using (
    exists (select 1 from public.vault_files f
            where f.id = vault_classification_results.file_id and f.user_id = auth.uid())
  );


-- ═══ vault_access_log ══════════════════════════════════════════════
create table if not exists public.vault_access_log (
  id          bigserial primary key,
  user_id     uuid not null,
  file_id     uuid,
  action      text not null
              check (action in ('upload','download','view','update','delete','restore','purge')),
  ip          inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists vault_access_log_user_time
  on public.vault_access_log (user_id, created_at desc);

alter table public.vault_access_log enable row level security;

drop policy if exists "vault_access_log_owner_select" on public.vault_access_log;
create policy "vault_access_log_owner_select"
  on public.vault_access_log for select
  using (user_id = auth.uid());


-- ═══ vault_shares (schema preparado; ui/actions em v2) ══════════════
create table if not exists public.vault_shares (
  id              uuid primary key default gen_random_uuid(),
  file_id         uuid not null references public.vault_files(id) on delete cascade,
  owner_id        uuid not null references auth.users(id) on delete cascade,
  shared_with_id  uuid not null references auth.users(id) on delete cascade,
  permission      text not null default 'read' check (permission in ('read', 'edit')),
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),

  unique (file_id, shared_with_id)
);

create index if not exists vault_shares_recipient on public.vault_shares (shared_with_id);

alter table public.vault_shares enable row level security;

drop policy if exists "vault_shares_owner_manage" on public.vault_shares;
create policy "vault_shares_owner_manage"
  on public.vault_shares for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "vault_shares_recipient_select" on public.vault_shares;
create policy "vault_shares_recipient_select"
  on public.vault_shares for select
  using (shared_with_id = auth.uid());


-- ═══ funções ═══════════════════════════════════════════════════════

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

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

create or replace function public.vault_quotas_recalc(p_user_id uuid)
returns void language plpgsql security definer as $$
begin
  insert into public.vault_quotas (user_id, used_bytes, file_count)
  values (p_user_id, 0, 0)
  on conflict (user_id) do nothing;

  update public.vault_quotas
  set used_bytes = coalesce((
        select sum(size_bytes) from public.vault_files
        where user_id = p_user_id
          and status = 'ready'
          and deleted_at is null
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
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    perform public.vault_quotas_recalc(new.user_id);
  elsif (tg_op = 'UPDATE') then
    if (old.size_bytes != new.size_bytes
        or old.status != new.status
        or old.deleted_at is distinct from new.deleted_at) then
      perform public.vault_quotas_recalc(new.user_id);
    end if;
  elsif (tg_op = 'DELETE') then
    perform public.vault_quotas_recalc(old.user_id);
  end if;
  return null;
end;
$$;

create or replace function public.vault_init_quota_for_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.vault_quotas (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;


-- ═══ triggers ═══════════════════════════════════════════════════════

drop trigger if exists vault_files_updated_at on public.vault_files;
create trigger vault_files_updated_at
  before update on public.vault_files
  for each row execute function public.set_updated_at();

drop trigger if exists vault_quotas_updated_at on public.vault_quotas;
create trigger vault_quotas_updated_at
  before update on public.vault_quotas
  for each row execute function public.set_updated_at();

drop trigger if exists vault_files_search_vector on public.vault_files;
create trigger vault_files_search_vector
  before insert or update of display_name, description, text_content
  on public.vault_files
  for each row execute function public.vault_files_update_search();

drop trigger if exists vault_files_quota_after on public.vault_files;
create trigger vault_files_quota_after
  after insert or update or delete on public.vault_files
  for each row execute function public.vault_files_quota_trigger();

drop trigger if exists vault_init_quota_after_signup on auth.users;
create trigger vault_init_quota_after_signup
  after insert on auth.users
  for each row execute function public.vault_init_quota_for_user();


-- ═══ back-fill ══════════════════════════════════════════════════════
insert into public.vault_quotas (user_id)
  select id from auth.users
  where id not in (select user_id from public.vault_quotas)
on conflict do nothing;


-- ═══ reload schema cache ═══════════════════════════════════════════
notify pgrst, 'reload schema';
