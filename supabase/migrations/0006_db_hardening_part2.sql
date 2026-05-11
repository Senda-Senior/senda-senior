-- ─── 0006_db_hardening_part2 ───────────────────────────────────────
-- Endurecimento parte 2/2: audit log particionado, RLS para tabelas
-- novas (0005), policies de storage com mime allowlist, pg_cron jobs
-- de purge.
--
-- Origem: docs/db-research.md §4 + §5 + §6 + docs/db-design-principles.md
--         (P3, P4, P6, P10)
--
-- Edge Functions associadas em supabase/functions/storage-cleanup-on-blob-delete/
-- e supabase/functions/audit-event-cleanup/
-- ───────────────────────────────────────────────────────────────────

-- ═══ §3.2 — RLS para vault_classifier_overrides (P7/D7.3) ═══════════
alter table public.vault_classifier_overrides enable row level security;

drop policy if exists "vault_classifier_overrides_owner" on public.vault_classifier_overrides;
create policy "vault_classifier_overrides_owner"
  on public.vault_classifier_overrides for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ═══ §3.3 — Audit log particionado (P4/D4.1-D4.6) ═══════════════════
create table public.vault_audit_events (
  id              bigserial,
  created_at      timestamptz not null default now(),
  actor_user_id   uuid references auth.users(id) on delete set null,
  event_class     text        not null check (event_class in ('security','access','crud')),
  event_type      text        not null,
  entity_type     text,
  entity_id       uuid,
  before_data     jsonb,
  after_data      jsonb,
  meta            jsonb       not null default '{}'::jsonb,
  retention_until timestamptz not null,
  primary key (id, created_at)
) partition by range (created_at);

-- §3.3 texto: IMMUTABLE; Postgres rejeita now() em IMMUTABLE — STABLE aqui.
create or replace function public.vault_audit_compute_retention(p_class text)
returns timestamptz
language sql
stable
set search_path = pg_temp
as $$
  select case p_class
    when 'security' then now() + interval '24 months'
    when 'access'   then now() + interval '12 months'
    when 'crud'     then now() + interval '6 months'
    else                 now() + interval '12 months'
  end;
$$;

create or replace function public.vault_audit_set_retention()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.retention_until is null then
    new.retention_until := public.vault_audit_compute_retention(new.event_class);
  end if;
  return new;
end;
$$;

drop trigger if exists vault_audit_set_retention on public.vault_audit_events;
create trigger vault_audit_set_retention
  before insert on public.vault_audit_events
  for each row execute function public.vault_audit_set_retention();

do $$
declare
  m int;
  start_date date;
  end_date date;
  partition_name text;
begin
  for m in 0..2 loop
    start_date := date_trunc('month', now() + make_interval(months => m))::date;
    end_date := date_trunc('month', now() + make_interval(months => m + 1))::date;
    partition_name := format('vault_audit_events_%s', to_char(start_date, 'YYYY_MM'));

    execute format(
      'create table if not exists public.%I partition of public.vault_audit_events for values from (%L) to (%L)',
      partition_name, start_date, end_date
    );
  end loop;
end $$;

create index if not exists vault_audit_events_actor_time
  on public.vault_audit_events (actor_user_id, created_at desc);

create index if not exists vault_audit_events_retention
  on public.vault_audit_events (retention_until);

alter table public.vault_audit_events enable row level security;

drop policy if exists "vault_audit_events_owner_select" on public.vault_audit_events;
create policy "vault_audit_events_owner_select"
  on public.vault_audit_events for select
  to authenticated
  using (actor_user_id = auth.uid());

-- ═══ §3.4 — Triggers de audit em vault_files (P4/D4.3) ═══════════════
create or replace function public.vault_files_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_event_type text;
  v_event_class text;
  v_before jsonb;
  v_after jsonb;
begin
  if (tg_op = 'INSERT') then
    v_event_type := 'file_create';
    v_event_class := 'crud';
    v_before := null;
    v_after := to_jsonb(new);
  elsif (tg_op = 'UPDATE') then
    if (old.deleted_at is null and new.deleted_at is not null) then
      v_event_type := 'file_soft_delete';
    elsif (old.deleted_at is not null and new.deleted_at is null) then
      v_event_type := 'file_restore';
    elsif (old.system_category_slug is distinct from new.system_category_slug
        or old.user_category_id is distinct from new.user_category_id) then
      v_event_type := 'file_recategorize';
    else
      v_event_type := 'file_update';
    end if;
    v_event_class := 'crud';
    v_before := to_jsonb(old);
    v_after := to_jsonb(new);
  elsif (tg_op = 'DELETE') then
    v_event_type := 'file_hard_delete';
    v_event_class := 'crud';
    v_before := to_jsonb(old);
    v_after := null;
  end if;

  insert into public.vault_audit_events (
    actor_user_id, event_class, event_type, entity_type, entity_id, before_data, after_data
  ) values (
    coalesce((case when tg_op = 'DELETE' then old.user_id else new.user_id end), null),
    v_event_class,
    v_event_type,
    'vault_file',
    coalesce((case when tg_op = 'DELETE' then old.id else new.id end), null),
    v_before,
    v_after
  );

  return coalesce(new, old);
end;
$$;

drop trigger if exists vault_files_audit on public.vault_files;
create trigger vault_files_audit
  after insert or update or delete on public.vault_files
  for each row execute function public.vault_files_audit_trigger();

-- ═══ §3.5 — Storage bucket — mime allowlist (P6/D6.1) ═══════════════
update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'text/plain',
  'text/markdown',
  'application/rtf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
  'text/csv',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/tiff',
  'image/bmp',
  'message/rfc822',
  'application/vnd.ms-outlook',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/dicom',
  'application/json',
  'application/xml',
  'text/xml',
  'application/x-yaml'
]
where id = 'vault';

-- ═══ §3.6 — pg_cron jobs (E) ═══════════════════════════════════════
create extension if not exists pg_cron;

create or replace function public.vault_files_purge_soft_deleted()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  with deletable as (
    select f.id
    from public.vault_files f
    join public.vault_quotas q on q.user_id = f.user_id
    join public.vault_tiers t on t.slug = q.tier
    where f.deleted_at is not null
      and f.deleted_at < now() - make_interval(days => t.trash_retention_days)
  ),
  deleted as (
    delete from public.vault_files
    where id in (select id from deletable)
    returning id
  )
  select count(*) into v_count from deleted;
  return v_count;
end;
$$;

select cron.schedule(
  'vault_purge_soft_deleted',
  '0 3 * * *',
  $$select public.vault_files_purge_soft_deleted();$$
);

create or replace function public.vault_files_purge_pending()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  with deleted as (
    delete from public.vault_files
    where status = 'pending'
      and created_at < now() - interval '60 minutes'
    returning id
  )
  select count(*) into v_count from deleted;
  return v_count;
end;
$$;

select cron.schedule(
  'vault_purge_pending',
  '*/15 * * * *',
  $$select public.vault_files_purge_pending();$$
);

create or replace function public.vault_audit_purge_expired()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  with deleted as (
    delete from public.vault_audit_events
    where retention_until < now()
    returning id
  )
  select count(*) into v_count from deleted;
  return v_count;
end;
$$;

select cron.schedule(
  'vault_audit_purge_expired',
  '0 4 * * *',
  $$select public.vault_audit_purge_expired();$$
);

create or replace function public.vault_audit_create_next_partition()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  start_date date;
  end_date date;
  partition_name text;
begin
  start_date := date_trunc('month', now() + interval '2 months')::date;
  end_date := date_trunc('month', now() + interval '3 months')::date;
  partition_name := format('vault_audit_events_%s', to_char(start_date, 'YYYY_MM'));

  execute format(
    'create table if not exists public.%I partition of public.vault_audit_events for values from (%L) to (%L)',
    partition_name, start_date, end_date
  );
end;
$$;

select cron.schedule(
  'vault_audit_create_partition',
  '0 0 1 * *',
  $$select public.vault_audit_create_next_partition();$$
);

notify pgrst, 'reload schema';
