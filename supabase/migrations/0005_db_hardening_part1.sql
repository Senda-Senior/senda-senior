-- ─── 0005_db_hardening_part1 ───────────────────────────────────────
-- Endurecimento parte 1/2: schema fixes, novas tabelas, CHECK constraints,
-- triggers de domínio e funções com SET search_path explícito.
--
-- Origem: docs/db-audit.md (F01, F02, F05) + docs/db-research.md +
--         docs/db-design-principles.md (P1-P3, P5, P7-P9)
--
-- IDEMPOTÊNCIA: este script pode ser re-executado em qualquer estado parcial.
-- Supabase Dashboard SQL Editor não envolve em transação única — cada
-- statement commita individual, então re-runs precisam ser safe.
-- Estratégias: IF NOT EXISTS em tabelas/colunas/índices, DO blocks com
-- EXCEPTION handler para constraints/policies, OR REPLACE em funções,
-- DROP IF EXISTS antes de CREATE TRIGGER.
-- ───────────────────────────────────────────────────────────────────

-- ═══ §2.2 — vault_tiers (P8/D8.3) ═══════════════════════════════════
-- NOTE: spec texto diz CHECK (version_limit >= 1) mas seed enterprise usa -1
-- (ilimitado). CHECK aqui permite -1 OU >= 1 para alinhar com §2.6 / Wave 2 A.
create table if not exists public.vault_tiers (
  slug              text        primary key,
  label             text        not null,
  limit_bytes       bigint      not null check (limit_bytes > 0),
  file_count_limit  int         not null check (file_count_limit > 0),
  version_limit     int         not null check (version_limit = -1 or version_limit >= 1),
  trash_retention_days int      not null check (trash_retention_days > 0),
  created_at        timestamptz not null default now()
);

insert into public.vault_tiers (slug, label, limit_bytes, file_count_limit, version_limit, trash_retention_days) values
  ('free',       'Free',       524288000,    1000,    1,   30),  -- 500MB, 1k files, sem histórico, 30d lixeira
  ('premium',    'Premium',    10737418240,  10000,   10,  90),  -- 10GB, 10k files, 10 versões, 90d
  ('enterprise', 'Enterprise', 107374182400, 100000,  -1,  365)  -- 100GB, 100k files, ilimitado (-1), 1 ano
on conflict (slug) do nothing;

alter table public.vault_tiers enable row level security;

drop policy if exists "vault_tiers_read" on public.vault_tiers;
create policy "vault_tiers_read"
  on public.vault_tiers for select
  to authenticated
  using (true);

-- ═══ §2.3 — vault_classifier_overrides (P7/D7.1-D7.6) ═════════════
-- DROP defensivo: types.ts referenciava esta tabela com schema antigo
-- (`id` como PK, sem `last_matched_at`). Tabela pode existir no banco
-- com esse schema legado — drop + recreate garante estado consistente.
-- Seguro pré-launch (actions.ts.upsert nunca funcionou nela, zero data).
drop table if exists public.vault_classifier_overrides cascade;

create table if not exists public.vault_classifier_overrides (
  user_id          uuid        not null references auth.users(id) on delete cascade,
  pattern          text        not null check (length(pattern) between 1 and 256),
  category_slug    text        not null references public.vault_system_categories(slug) on delete cascade,
  weight           int         not null default 12 check (weight > 0),
  match_count      int         not null default 0 check (match_count >= 0),
  last_matched_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (user_id, pattern)
);

create index if not exists vault_classifier_overrides_recent
  on public.vault_classifier_overrides (user_id, last_matched_at desc nulls last);

drop trigger if exists vault_classifier_overrides_updated_at
  on public.vault_classifier_overrides;
create trigger vault_classifier_overrides_updated_at
  before update on public.vault_classifier_overrides
  for each row execute function public.set_updated_at();

alter table public.vault_classifier_overrides enable row level security;

-- ═══ §2.7 — Refactor funções: SET search_path (P5/D5.1-D5.4) ═══════
-- set_updated_at primeiro (trigger §2.3 depende do nome da função)

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.vault_files_quota_trigger()
returns trigger
language plpgsql
set search_path = public, pg_temp
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

create or replace function public.vault_blobs_quota_trigger()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  uid uuid;
  fid uuid;
begin
  if (tg_op = 'DELETE') then fid := old.file_id;
  else fid := new.file_id;
  end if;
  select user_id into uid from public.vault_files where id = fid;
  if uid is not null then
    perform public.vault_quotas_recalc(uid);
  end if;
  return coalesce(new, old);
end;
$$;

create or replace function public.vault_file_blobs_sync_version_count()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  fid uuid;
begin
  if tg_op = 'DELETE' then fid := old.file_id;
  else fid := new.file_id;
  end if;
  update public.vault_files
  set version_count = coalesce((select count(*)::int from public.vault_file_blobs where file_id = fid), 0)
  where id = fid;
  return coalesce(new, old);
end;
$$;

-- ═══ §2.4 — CHECK constraints (P1/D1.1-D1.8) ═══════════════════════
-- Cada ALTER ADD CONSTRAINT em DO block que ignora duplicate_object (idempotente).

do $$ begin
  alter table public.vault_files
    add constraint vault_files_original_name_length
      check (length(original_name) between 1 and 255);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.vault_files
    add constraint vault_files_text_content_size
      check (text_content is null or length(text_content) <= 10485760);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.vault_categories
    add constraint vault_categories_label_length
      check (length(label) between 1 and 64);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.vault_categories
    add constraint vault_categories_slug_format
      check (slug ~ '^[a-z0-9_-]+$' and length(slug) between 1 and 64);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.vault_tags
    add constraint vault_tags_label_length
      check (length(label) between 1 and 64);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.vault_tags
    add constraint vault_tags_slug_format
      check (slug ~ '^[a-z0-9_-]+$' and length(slug) between 1 and 64);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.vault_file_blobs
    add constraint vault_file_blobs_mime_format
      check (mime_type ~ '^[a-z0-9.\-+]+\/[a-z0-9.\-+]+$' and length(mime_type) <= 255);
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.vault_file_blobs
    add constraint vault_file_blobs_extension_format
      check (length(extension) between 0 and 16 and extension = lower(extension));
exception when duplicate_object then null;
end $$;

-- ═══ §2.5 — content_sha256 denormalizado (P2/D2.1) ══════════════════

alter table public.vault_files
  add column if not exists content_sha256 text;

do $$ begin
  alter table public.vault_files
    add constraint vault_files_content_sha256_format
      check (content_sha256 is null or length(content_sha256) = 64);
exception when duplicate_object then null;
end $$;

create unique index if not exists vault_files_user_content_unique
  on public.vault_files (user_id, content_sha256)
  where deleted_at is null and content_sha256 is not null;

create or replace function public.vault_files_sync_content_sha256()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.current_blob_id is null then
    new.content_sha256 := null;
  else
    select sha256 into new.content_sha256
    from public.vault_file_blobs
    where id = new.current_blob_id;
  end if;
  return new;
end;
$$;

drop trigger if exists vault_files_content_sha256_sync on public.vault_files;
create trigger vault_files_content_sha256_sync
  before insert or update of current_blob_id on public.vault_files
  for each row execute function public.vault_files_sync_content_sha256();

-- ═══ §2.6 — purge automático de versões por tier (P2/D2.2) ═════════

create or replace function public.vault_blobs_enforce_version_limit()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_tier_slug text;
  v_version_limit int;
begin
  select f.user_id, q.tier into v_user_id, v_tier_slug
  from public.vault_files f
  join public.vault_quotas q on q.user_id = f.user_id
  where f.id = new.file_id;

  if v_user_id is null then return new; end if;

  select version_limit into v_version_limit
  from public.vault_tiers
  where slug = v_tier_slug;

  if v_version_limit = -1 then return new; end if;

  delete from public.vault_file_blobs
  where file_id = new.file_id
    and id not in (
      select id from public.vault_file_blobs
      where file_id = new.file_id
      order by version desc
      limit v_version_limit
    );

  return new;
end;
$$;

drop trigger if exists vault_blobs_version_limit on public.vault_file_blobs;
create trigger vault_blobs_version_limit
  after insert on public.vault_file_blobs
  for each row execute function public.vault_blobs_enforce_version_limit();

-- ═══ §2.8 — quota enforcement BEFORE INSERT (P8/D8.1) ═════════════

create or replace function public.vault_quotas_enforce_limit()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_used bigint;
  v_limit bigint;
begin
  select user_id into v_user_id
  from public.vault_files
  where id = new.file_id;

  if v_user_id is null then return new; end if;

  select used_bytes, limit_bytes into v_used, v_limit
  from public.vault_quotas
  where user_id = v_user_id;

  if v_used + new.size_bytes > v_limit then
    raise exception 'vault_quota_exceeded'
      using hint = format('User %s would exceed limit (%s + %s > %s)', v_user_id, v_used, new.size_bytes, v_limit),
            errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists vault_blobs_enforce_quota on public.vault_file_blobs;
create trigger vault_blobs_enforce_quota
  before insert on public.vault_file_blobs
  for each row execute function public.vault_quotas_enforce_limit();

-- ═══ §2.9 — reload schema cache ═════════════════════════════════════

notify pgrst, 'reload schema';
