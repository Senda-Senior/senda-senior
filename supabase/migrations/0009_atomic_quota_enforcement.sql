-- ─── 0009: atomic quota enforcement ────────────────────────────────
-- Replaces the BEFORE INSERT trigger on vault_file_blobs (0005 §2.8).
-- Uses atomic UPDATE instead of SELECT + check to prevent TOCTOU races.

create or replace function public.vault_quotas_enforce_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_updated integer;
begin
  select user_id into v_user_id
  from public.vault_files
  where id = new.file_id;

  if v_user_id is null then return new; end if;

  -- Atomic check-and-increment. Concurrent triggers on the same user serialize
  -- because UPDATE acquires a row lock on vault_quotas before reading used_bytes.
  update public.vault_quotas
  set used_bytes = used_bytes + new.size_bytes
  where user_id = v_user_id
    and used_bytes + new.size_bytes <= limit_bytes;

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    raise exception 'vault_quota_exceeded'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

-- Trigger already exists from 0005; replacing the function is sufficient.
-- No need to drop/recreate the trigger itself.

notify pgrst, 'reload schema';
