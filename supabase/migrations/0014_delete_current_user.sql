-- 0014_delete_current_user.sql
-- Exclusão de conta pelo próprio titular (LGPD art. 18 — eliminação de dados).
--
-- Como o app NÃO usa a chave service-role (ver src/lib/supabase/admin.ts), a remoção
-- do usuário em `auth.users` é feita por uma função SECURITY DEFINER: ela roda com os
-- privilégios do dono (postgres), mas usa `auth.uid()` para apagar APENAS o usuário que
-- fez a chamada. As tabelas de domínio (`profiles`, `care_checklist_items`, `vault_*`)
-- têm FK `on delete cascade` para `auth.users(id)`, então somem junto. A trilha de
-- auditoria (`vault_audit_events.actor_user_id`) é `on delete set null` — preservada e
-- anonimizada de propósito.
--
-- Os BLOBS do Storage (bucket `vault`) NÃO cascateiam: são removidos pela server action
-- (deleteAccountAction) via Storage API antes desta chamada.

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Cascades (on delete cascade) limpam public.* ligados a este usuário.
  delete from auth.users where id = v_uid;
end;
$$;

-- Somente usuários autenticados podem se auto-excluir. Nunca anon/public.
revoke all on function public.delete_current_user() from public;
revoke all on function public.delete_current_user() from anon;
grant execute on function public.delete_current_user() to authenticated;
