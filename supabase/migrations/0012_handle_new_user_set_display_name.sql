-- 0012_handle_new_user_set_display_name.sql
-- Fixa handle_new_user() — popula display_name a partir de user_metadata no signup
-- Tabelas: public.profiles (trigger de auth.users)

-- ─── 0012: handle_new_user — popula display_name a partir de user_metadata ──
--
-- Problema: 0004 criou handle_new_user() inserindo o profile com user_id
-- apenas. O display_name ficava NULL até o usuário confirmar o e-mail e
-- o auth callback (route.ts) escrever o nome via UPDATE.
-- Isso fazia a UI exibir o email no lugar do nome para usuários novos.
--
-- Fix: lê full_name / first_name + last_name / name de raw_user_meta_data
-- (preenchidos pelo signUp() no frontend) e insere direto no profile.
-- Se não houver metadata de nome, mantém NULL — callback ainda cobre
-- o fluxo de OAuth (Google, Facebook) onde o nome chega depois.
--
-- A revogação de EXECUTE de 0007 continua válida — esta versão só
-- substitui o corpo da função, não altera SECURITY DEFINER.
-- ───────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_display_name text;
begin
  -- Tenta extrair nome da metadata enviada no signUp()
  v_display_name :=
    coalesce(
      nullif(trim((new.raw_user_meta_data->>'full_name')),   ''),
      nullif(trim(
        concat_ws(' ',
          nullif(trim(new.raw_user_meta_data->>'first_name'), ''),
          nullif(trim(new.raw_user_meta_data->>'last_name'),  '')
        )
      ), ''),
      nullif(trim((new.raw_user_meta_data->>'name')),        '')
    );

  insert into public.profiles (user_id, display_name)
    values (new.id, v_display_name)
    on conflict (user_id) do update
      set display_name = coalesce(public.profiles.display_name, excluded.display_name);

  insert into public.vault_quotas (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

  return new;
end;
$$;
