-- 0011_revoke_quota_enforce_execute.sql
-- Revoga EXECUTE de vault_quotas_enforce_limit() — resolve Security Advisor warnings
-- Tabelas: nenhuma (revoga permissions)

-- ─── 0011_revoke_quota_enforce_execute ─────────────────────────────
-- Resolve os warnings remanescentes do Supabase Security Advisor:
-- "Public Can Execute SECURITY DEFINER Function" e
-- "Signed-In Users Can Execute SECURITY DEFINER Function" para
-- public.vault_quotas_enforce_limit().
--
-- Contexto: 0007 revogou EXECUTE de todas as funções SECURITY DEFINER
-- existentes na época. Porém 0009 recriou vault_quotas_enforce_limit()
-- COM security definer (antes era invoker, 0005 §2.8) e não revogou —
-- a função voltou a ficar exposta via POST /rest/v1/rpc/<fn> com o
-- grant default de EXECUTE para PUBLIC.
--
-- Fix: mesmo padrão do 0007. O trigger em vault_file_blobs continua
-- funcionando — triggers rodam como owner da função, não dependem
-- desse GRANT.
--
-- Bônus: revoga também public.rls_auto_enable() (função managed do
-- Supabase, ver docs/db-hardening-closure.md). Guardada em DO block
-- porque pode não existir em ambientes locais/CI.
--
-- REVOKE é idempotente (re-runs = no-op).
-- ───────────────────────────────────────────────────────────────────

revoke execute on function public.vault_quotas_enforce_limit() from public, authenticated, anon;

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'rls_auto_enable'
  ) then
    revoke execute on function public.rls_auto_enable() from public, authenticated, anon;
  end if;
end $$;

notify pgrst, 'reload schema';
