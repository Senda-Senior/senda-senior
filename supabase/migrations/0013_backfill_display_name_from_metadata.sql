-- 0013_backfill_display_name_from_metadata.sql
-- Retroage display_name para usuários existentes com NULL/vazio — lê raw_user_meta_data
-- Tabelas: public.profiles (backfill)

-- ─── 0013: backfill display_name para usuários existentes ───────────
--
-- 0012 corrigiu handle_new_user() para novos cadastros. Esta migration
-- retroage o mesmo preenchimento para usuários que já existiam com
-- display_name NULL ou vazio, lendo raw_user_meta_data de auth.users.
--
-- Condições de segurança:
--   - Só atualiza linhas com display_name NULL ou '' (nunca sobrescreve)
--   - Só age se houver pelo menos um campo de nome na metadata
--   - nullif(trim(...), '') impede strings vazias de serem gravadas
--   - Idempotente: re-executar não altera nada
-- ───────────────────────────────────────────────────────────────────

update public.profiles p
set display_name = coalesce(
  nullif(trim(u.raw_user_meta_data->>'full_name'),  ''),
  nullif(trim(
    concat_ws(' ',
      nullif(trim(u.raw_user_meta_data->>'first_name'), ''),
      nullif(trim(u.raw_user_meta_data->>'last_name'),  '')
    )
  ), ''),
  nullif(trim(u.raw_user_meta_data->>'name'), '')
)
from auth.users u
where p.user_id = u.id
  and (p.display_name is null or p.display_name = '')
  and (
    (u.raw_user_meta_data->>'full_name')  is not null or
    (u.raw_user_meta_data->>'first_name') is not null or
    (u.raw_user_meta_data->>'name')       is not null
  );
