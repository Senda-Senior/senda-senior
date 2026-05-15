-- Fix upload regression introduced after 0007.
--
-- Root cause:
-- - 0007 revoked EXECUTE on public.vault_quotas_recalc(uuid) from
--   authenticated/anon/public.
-- - The quota trigger functions still run as the caller, and they invoke
--   vault_quotas_recalc() during INSERT/UPDATE/DELETE on vault_files and
--   vault_file_blobs.
-- - Result: normal user writes fail with
--   "permission denied for function vault_quotas_recalc".
--
-- Safe fix:
-- - Make the 2 quota trigger functions SECURITY DEFINER so they execute as
--   their owner when called by triggers.
-- - Revoke direct EXECUTE on these trigger helpers as well, so they are not
--   callable via RPC by authenticated/anon/public.

create or replace function public.vault_files_quota_trigger()
returns trigger
language plpgsql
security definer
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
security definer
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

revoke execute on function public.vault_files_quota_trigger() from public, authenticated, anon;
revoke execute on function public.vault_blobs_quota_trigger() from public, authenticated, anon;

notify pgrst, 'reload schema';
