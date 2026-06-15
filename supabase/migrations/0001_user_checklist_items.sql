-- 0001_user_checklist_items.sql
-- Cria user_checklist_items — persiste estado do checklist Prevent Care do dashboard
-- Tabelas: public.user_checklist_items

-- ════════════════════════════════════════════════════════════════════
-- 0001 — user_checklist_items
--
-- Persiste o estado de cada item do "Checklist Prevent Care" exibido
-- no dashboard. Um registro por (user_id, item_key) com a flag `done`.
--
-- Por que `item_key` (texto) e não `item_id` (int)?
--   Os IDs do checklist hoje são definidos no código (1..6). Quando
--   editorialmente quisermos adicionar/remover um item, basta mudar
--   o array em código sem migration. Usamos `item_key` (slug curto)
--   como contrato estável entre app e DB.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.user_checklist_items (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  item_key    text        not null,
  done        boolean     not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, item_key)
);

-- Trigger para manter `updated_at` automaticamente.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_user_checklist_items on public.user_checklist_items;
create trigger touch_user_checklist_items
  before update on public.user_checklist_items
  for each row execute function public.touch_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────
alter table public.user_checklist_items enable row level security;

drop policy if exists "Users read own checklist" on public.user_checklist_items;
create policy "Users read own checklist"
  on public.user_checklist_items
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users insert own checklist" on public.user_checklist_items;
create policy "Users insert own checklist"
  on public.user_checklist_items
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users update own checklist" on public.user_checklist_items;
create policy "Users update own checklist"
  on public.user_checklist_items
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own checklist" on public.user_checklist_items;
create policy "Users delete own checklist"
  on public.user_checklist_items
  for delete
  to authenticated
  using (auth.uid() = user_id);
