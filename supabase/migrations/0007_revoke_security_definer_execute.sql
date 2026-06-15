-- 0007_revoke_security_definer_execute.sql
-- Revoga EXECUTE de funções SECURITY DEFINER — resolve Supabase Security Advisor warnings
-- Tabelas: nenhuma (revoga permissions)

-- ─── 0007_revoke_security_definer_execute ─────────────────────────
-- Resolve FU-F: warnings do Supabase Security Advisor para
-- "Public Can Execute SECURITY DEFINER Function" e
-- "Signed-In Users Can Execute SECURITY DEFINER Function".
--
-- Contexto: Postgres concede EXECUTE para PUBLIC por default em
-- CREATE FUNCTION. Supabase expõe automaticamente funções do schema
-- 'public' como endpoints RPC em POST /rest/v1/rpc/<fn>. SECURITY
-- DEFINER bypassa RLS — combinação = qualquer usuário (até anon)
-- pode invocar operações privilegiadas via HTTP.
--
-- Fix: REVOKE EXECUTE de PUBLIC, authenticated, anon. Triggers e
-- pg_cron jobs rodam como 'postgres' (owner) — não dependem desse
-- GRANT, continuam funcionando.
--
-- REVOKE é idempotente (re-runs = no-op).
--
-- Funções afetadas (todas com SECURITY DEFINER):
--   - 0004: handle_new_user, vault_quotas_recalc
--   - 0006: vault_files_audit_trigger, vault_files_purge_soft_deleted,
--           vault_files_purge_pending, vault_audit_purge_expired,
--           vault_audit_create_next_partition
--
-- Não afeta:
--   - Funções não-DEFINER (set_updated_at, *_quota_trigger, etc) —
--     já rodam como caller, RLS aplica
--   - Funções de extensions (rls_auto_enable etc) — managed pelo Supabase
-- ───────────────────────────────────────────────────────────────────

revoke execute on function public.handle_new_user() from public, authenticated, anon;

revoke execute on function public.vault_quotas_recalc(uuid) from public, authenticated, anon;

revoke execute on function public.vault_files_audit_trigger() from public, authenticated, anon;

revoke execute on function public.vault_files_purge_soft_deleted() from public, authenticated, anon;

revoke execute on function public.vault_files_purge_pending() from public, authenticated, anon;

revoke execute on function public.vault_audit_purge_expired() from public, authenticated, anon;

revoke execute on function public.vault_audit_create_next_partition() from public, authenticated, anon;

notify pgrst, 'reload schema';
