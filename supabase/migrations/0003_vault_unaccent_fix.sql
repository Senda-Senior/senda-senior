-- 0003_vault_unaccent_fix.sql
-- Corrige trigger de search_vector — fixa search_path de vault_files_update_search()
-- Tabelas: public.vault_files (função de trigger)

-- ─── 0003_vault_unaccent_fix ─────────────────────────────────────────
-- Corrige o trigger de search_vector. No Supabase, a extensão
-- `unaccent` mora no schema `extensions`, e funções no schema `public`
-- não o têm no search_path por padrão.
--
-- Soluções aplicadas:
--   1. prefixa chamadas como `extensions.unaccent(...)`
--   2. define `search_path` explícito na função para blindar
-- ─────────────────────────────────────────────────────────────────────

-- garante que a extensão existe (no-op se já instalada)
create extension if not exists "unaccent" with schema extensions;

create or replace function public.vault_files_update_search()
returns trigger
language plpgsql
set search_path = public, extensions, pg_temp
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('portuguese', extensions.unaccent(coalesce(new.display_name, ''))), 'A') ||
    setweight(to_tsvector('portuguese', extensions.unaccent(coalesce(new.description, ''))),  'B') ||
    setweight(to_tsvector('portuguese', extensions.unaccent(coalesce(new.text_content, ''))), 'C');
  return new;
end;
$$;

-- força PostgREST a recarregar o schema (resolve PGRST205 "table not found in cache")
notify pgrst, 'reload schema';
