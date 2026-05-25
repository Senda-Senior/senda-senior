-- ─── 0010: security hardening round 3 ─────────────────────────────────────
-- FU-03 : Audit trigger actor changed from file owner → auth.uid()
--         NULL actor = system/cron operation (correct for purge jobs)
-- FU-01 : Explicit RESTRICTIVE deny on vault_quotas INSERT/UPDATE/DELETE
--         (implicit deny already applied; explicit for LGPD audit compliance)
-- ORPHANED: vault_files_purge_pending() augmented to also delete storage objects
--           (0006 §3.2 only deleted DB records; storage objects were orphaned)

-- ═══ §1 — Fix audit trigger actor (FU-03) ═════════════════════════════════
create or replace function public.vault_files_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_event_type  text;
  v_event_class text;
  v_before      jsonb;
  v_after       jsonb;
begin
  if (tg_op = 'INSERT') then
    v_event_type  := 'file_create';
    v_event_class := 'crud';
    v_before      := null;
    v_after       := to_jsonb(new);
  elsif (tg_op = 'UPDATE') then
    if    (old.deleted_at is null and new.deleted_at is not null) then
      v_event_type := 'file_soft_delete';
    elsif (old.deleted_at is not null and new.deleted_at is null) then
      v_event_type := 'file_restore';
    elsif (old.system_category_slug is distinct from new.system_category_slug
        or old.user_category_id    is distinct from new.user_category_id) then
      v_event_type := 'file_recategorize';
    else
      v_event_type := 'file_update';
    end if;
    v_event_class := 'crud';
    v_before      := to_jsonb(old);
    v_after       := to_jsonb(new);
  elsif (tg_op = 'DELETE') then
    v_event_type  := 'file_hard_delete';
    v_event_class := 'crud';
    v_before      := to_jsonb(old);
    v_after       := null;
  end if;

  insert into public.vault_audit_events (
    actor_user_id, event_class, event_type, entity_type, entity_id, before_data, after_data
  ) values (
    -- auth.uid() is null when triggered by cron/SECURITY DEFINER purge = system op
    auth.uid(),
    v_event_class,
    v_event_type,
    'vault_file',
    coalesce(case when tg_op = 'DELETE' then old.id else new.id end, null),
    v_before,
    v_after
  );

  return coalesce(new, old);
end;
$$;

-- ═══ §2 — Explicit deny RLS on vault_quotas (FU-01) ══════════════════════
-- vault_quotas rows are managed exclusively via SECURITY DEFINER triggers.
-- Direct mutations by authenticated users are already implicitly denied
-- (RLS enabled, no permissive policy). These explicit RESTRICTIVE policies
-- make the intent auditable for LGPD compliance.

drop policy if exists "vault_quotas_deny_insert" on public.vault_quotas;
create policy "vault_quotas_deny_insert"
  on public.vault_quotas
  as restrictive
  for insert
  to authenticated
  with check (false);

drop policy if exists "vault_quotas_deny_update" on public.vault_quotas;
create policy "vault_quotas_deny_update"
  on public.vault_quotas
  as restrictive
  for update
  to authenticated
  using (false)
  with check (false);

drop policy if exists "vault_quotas_deny_delete" on public.vault_quotas;
create policy "vault_quotas_deny_delete"
  on public.vault_quotas
  as restrictive
  for delete
  to authenticated
  using (false);

-- ═══ §3 — Augment vault_files_purge_pending to clean storage objects ══════
-- 0006 §3.2 created vault_files_purge_pending() which deletes DB records but
-- leaves the uploaded storage objects orphaned. An attacker could call
-- prepareUpload() repeatedly, upload files, and never confirm — filling
-- storage without consuming quota (quota only counts 'ready' files).
--
-- Storage path pattern: '{user_id}/{file_id}.{ext}' or '{user_id}/{file_id}'.
-- Extension is unknown at purge time (stored in vault_file_blobs, which may
-- not exist yet), so we match on the user_id/file_id prefix.

create or replace function public.vault_files_purge_pending()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  -- Delete storage objects matching pending file path prefixes.
  -- If storage schema perms are unavailable, skip and let lifecycle handle it.
  begin
    delete from storage.objects
    using (
      select f.user_id::text || '/' || f.id::text as path_prefix
      from public.vault_files f
      where f.status = 'pending'
        and f.created_at < now() - interval '60 minutes'
    ) pending_files
    where bucket_id = 'vault'
      and name like pending_files.path_prefix || '%';
  exception when insufficient_privilege then
    null;
  end;

  -- Delete vault_files records; vault_file_blobs cascade via FK ON DELETE CASCADE.
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
