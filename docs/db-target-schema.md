# DB Target Schema — Wave 3

**Branch:** `chore/db-hardening`
**Data:** 2026-05-11
**Pré-requisitos:** [docs/db-audit.md](db-audit.md), [docs/db-research.md](db-research.md), [docs/db-design-principles.md](db-design-principles.md).

**Decisões consolidadas (Wave 2):**
- A) Versionamento híbrido por tier (free=1, premium=10, enterprise=todas)
- B) Audit log retenção diferenciada (segurança 24m, acesso 12m, CRUD 6m)
- C) 3 tiers fixos via `vault_tiers` (seed)
- D) Storage allowlist fechada de mime types
- E) pg_cron pra SQL puro + Edge Functions pra storage cleanup

**Propósito:** especificação completa do schema alvo. Cada DDL é amarrado a uma decisão da Wave 2, que aponta pra um princípio, que aponta pra uma fonte. Cadeia completa.

Wave 4 vai dividir esse documento em 2 prompts de Cursor workers paralelos.

---

## 1. Mapa de migrations

```
0001_user_checklist_items.sql   (histórico — substituído por 0004)
0002_vault.sql                  (histórico — substituído por 0004)
0003_vault_unaccent_fix.sql     (histórico — folded em 0004)
0004_remodel_context_vault.sql  (estado atual em main)

0005_db_hardening_part1.sql     ← Worker A (DDL + CHECK + tabelas novas)
0006_db_hardening_part2.sql     ← Worker B (RLS + audit log + storage policies + cron + edge)
```

**Por que 2 migrations e não 1:** divide o trabalho em 2 workers Cursor paralelos sem conflito de merge. Worker A foca DDL ortogonal a Worker B (tabelas e CHECK vs políticas e jobs). Cada migration é independentemente reversível em emergência.

**Esta é a última janela pré-launch para mudanças destrutivas.** A partir de 0007 em diante, regra é additive-only (P9/D9.2).

---

## 2. Worker A — Migration `0005_db_hardening_part1.sql`

Escopo: tabelas novas + CHECK constraints + functions + triggers de domínio. Sem RLS nova nem audit (Worker B faz isso).

### 2.1. Cabeçalho da migration

```sql
-- ─── 0005_db_hardening_part1 ───────────────────────────────────────
-- Endurecimento parte 1/2: schema fixes, novas tabelas, CHECK constraints,
-- triggers de domínio e funções com SET search_path explícito.
--
-- Origem: docs/db-audit.md (F01, F02, F05) + docs/db-research.md +
--         docs/db-design-principles.md (P1-P3, P5, P7-P9)
--
-- Idempotente em ambiente dev (drop+recreate onde quebra invariantes).
-- Em prod aplicar com backup. Última migration destrutiva (P9/D9.1).
-- Próximas migrations (0007+): additive-only (ALTER ADD COLUMN, etc).
-- ───────────────────────────────────────────────────────────────────
```

### 2.2. Tabela `vault_tiers` (NOVA — P8/D8.3)

```sql
create table public.vault_tiers (
  slug              text        primary key,
  label             text        not null,
  limit_bytes       bigint      not null check (limit_bytes > 0),
  file_count_limit  int         not null check (file_count_limit > 0),
  version_limit     int         not null check (version_limit >= 1),
  trash_retention_days int      not null check (trash_retention_days > 0),
  created_at        timestamptz not null default now()
);

insert into public.vault_tiers (slug, label, limit_bytes, file_count_limit, version_limit, trash_retention_days) values
  ('free',       'Free',       524288000,    1000,    1,   30),  -- 500MB, 1k files, sem histórico, 30d lixeira
  ('premium',    'Premium',    10737418240,  10000,   10,  90),  -- 10GB, 10k files, 10 versões, 90d
  ('enterprise', 'Enterprise', 107374182400, 100000,  -1,  365)  -- 100GB, 100k files, ilimitado (-1), 1 ano
on conflict (slug) do nothing;

alter table public.vault_tiers enable row level security;

create policy "vault_tiers_read"
  on public.vault_tiers for select
  to authenticated
  using (true);
```

**Justificativa:** centraliza configuração de tier. App lê limites daqui em vez de hardcoded. `-1` no `version_limit` = ilimitado (interpretado pelo trigger). RLS read-only pra todos (transparente: usuário pode ver o que vem em cada tier).

### 2.3. Tabela `vault_classifier_overrides` (NOVA — P7/D7.1-D7.6)

```sql
create table public.vault_classifier_overrides (
  user_id          uuid        not null references auth.users(id) on delete cascade,
  pattern          text        not null check (length(pattern) between 1 and 256),
  category_slug    text        not null references public.vault_system_categories(slug) on delete cascade,
  weight           int         not null default 12 check (weight > 0),
  match_count      int         not null default 0 check (match_count >= 0),
  last_matched_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (user_id, pattern)
);

create index vault_classifier_overrides_recent
  on public.vault_classifier_overrides (user_id, last_matched_at desc nulls last);

drop trigger if exists vault_classifier_overrides_updated_at
  on public.vault_classifier_overrides;
create trigger vault_classifier_overrides_updated_at
  before update on public.vault_classifier_overrides
  for each row execute function public.set_updated_at();
```

**Justificativa:** resolve F01 (CRITICAL). Schema espelha o uso atual em `actions.ts:345` exatamente. PK composto `(user_id, pattern)` permite upsert por padrão. `last_matched_at` registra recência pra ordenação por relevância (`actions.ts:455` ordena por `match_count` hoje, mas `last_matched_at DESC` é melhor sinal).

### 2.4. CHECK constraints faltantes (P1/D1.1-D1.8)

```sql
-- vault_files: invariantes faltantes
alter table public.vault_files
  add constraint vault_files_original_name_length
    check (length(original_name) between 1 and 255);

alter table public.vault_files
  add constraint vault_files_text_content_size
    check (text_content is null or length(text_content) <= 10485760);  -- 10MB max

-- vault_categories: label/slug
alter table public.vault_categories
  add constraint vault_categories_label_length
    check (length(label) between 1 and 64);

alter table public.vault_categories
  add constraint vault_categories_slug_format
    check (slug ~ '^[a-z0-9_-]+$' and length(slug) between 1 and 64);

-- vault_tags: label/slug
alter table public.vault_tags
  add constraint vault_tags_label_length
    check (length(label) between 1 and 64);

alter table public.vault_tags
  add constraint vault_tags_slug_format
    check (slug ~ '^[a-z0-9_-]+$' and length(slug) between 1 and 64);

-- vault_file_blobs: mime_type formato + extension
alter table public.vault_file_blobs
  add constraint vault_file_blobs_mime_format
    check (mime_type ~ '^[a-z0-9.\-+]+\/[a-z0-9.\-+]+$' and length(mime_type) <= 255);

alter table public.vault_file_blobs
  add constraint vault_file_blobs_extension_format
    check (length(extension) between 0 and 16 and extension = lower(extension));
```

**Justificativa:** defesa em profundidade (P1). Hoje só zod valida; bypass via SQL direto corromperia. `text_content` 10MB cap previne OCR runaway futuro (P1/D1.2).

### 2.5. Trigger — content_sha256 denormalizado em vault_files (P2/D2.1)

```sql
alter table public.vault_files
  add column if not exists content_sha256 text;

alter table public.vault_files
  add constraint vault_files_content_sha256_format
    check (content_sha256 is null or length(content_sha256) = 64);

-- Índice de unicidade: 1 conteúdo por usuário (excluindo lixeira)
create unique index if not exists vault_files_user_content_unique
  on public.vault_files (user_id, content_sha256)
  where deleted_at is null and content_sha256 is not null;

-- Trigger sync: ao mudar current_blob_id, copia sha256 do blob
create or replace function public.vault_files_sync_content_sha256()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.current_blob_id is null then
    new.content_sha256 := null;
  else
    select sha256 into new.content_sha256
    from public.vault_file_blobs
    where id = new.current_blob_id;
  end if;
  return new;
end;
$$;

drop trigger if exists vault_files_content_sha256_sync on public.vault_files;
create trigger vault_files_content_sha256_sync
  before insert or update of current_blob_id on public.vault_files
  for each row execute function public.vault_files_sync_content_sha256();
```

**Justificativa:** P2 (CAS canônico). Hoje a checagem de duplicata é só no `prepareUpload` em código — race condition possível. Constraint UNIQUE no banco fortifica. Coluna denormalizada permite o índice (índice em FK indireta seria possível mas mais lento).

### 2.6. Trigger — purge automático de versões por tier (P2/D2.2 — A híbrido)

```sql
create or replace function public.vault_blobs_enforce_version_limit()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_tier_slug text;
  v_version_limit int;
begin
  -- Resolve tier do user dono do file
  select f.user_id, q.tier into v_user_id, v_tier_slug
  from public.vault_files f
  join public.vault_quotas q on q.user_id = f.user_id
  where f.id = new.file_id;

  if v_user_id is null then return new; end if;

  -- Lê limit do tier
  select version_limit into v_version_limit
  from public.vault_tiers
  where slug = v_tier_slug;

  -- -1 = ilimitado (enterprise)
  if v_version_limit = -1 then return new; end if;

  -- Apaga versões mais antigas além do limite (mantém as version_limit mais novas)
  delete from public.vault_file_blobs
  where file_id = new.file_id
    and id not in (
      select id from public.vault_file_blobs
      where file_id = new.file_id
      order by version desc
      limit v_version_limit
    );

  return new;
end;
$$;

drop trigger if exists vault_blobs_version_limit on public.vault_file_blobs;
create trigger vault_blobs_version_limit
  after insert on public.vault_file_blobs
  for each row execute function public.vault_blobs_enforce_version_limit();
```

**Justificativa:** A) versionamento híbrido por tier. Free tier mantém só 1 versão (atual sobrescreve antiga). Premium mantém 10. Enterprise mantém todas. Limpeza imediata após insert do novo blob — storage tight.

**Trade-off:** isso DELETA blobs antigos do banco; o storage object correspondente vira órfão. **Edge Function (Worker B) fará cleanup do storage object** triggered por DELETE em `vault_file_blobs`.

### 2.7. Refactor — funções existentes ganham `SET search_path` (P5/D5.1-D5.4)

```sql
-- set_updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- vault_files_quota_trigger
create or replace function public.vault_files_quota_trigger()
returns trigger
language plpgsql
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

-- vault_blobs_quota_trigger
create or replace function public.vault_blobs_quota_trigger()
returns trigger
language plpgsql
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

-- vault_file_blobs_sync_version_count
create or replace function public.vault_file_blobs_sync_version_count()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  fid uuid;
begin
  if tg_op = 'DELETE' then fid := old.file_id;
  else fid := new.file_id;
  end if;
  update public.vault_files
  set version_count = coalesce((select count(*)::int from public.vault_file_blobs where file_id = fid), 0)
  where id = fid;
  return coalesce(new, old);
end;
$$;
```

### 2.8. Quota enforcement no banco (P8/D8.1)

```sql
create or replace function public.vault_quotas_enforce_limit()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_used bigint;
  v_limit bigint;
begin
  -- Resolve user_id do file dono do blob
  select user_id into v_user_id
  from public.vault_files
  where id = new.file_id;

  if v_user_id is null then return new; end if;

  -- Quota atual
  select used_bytes, limit_bytes into v_used, v_limit
  from public.vault_quotas
  where user_id = v_user_id;

  if v_used + new.size_bytes > v_limit then
    raise exception 'vault_quota_exceeded'
      using hint = format('User %s would exceed limit (%s + %s > %s)', v_user_id, v_used, new.size_bytes, v_limit),
            errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists vault_blobs_enforce_quota on public.vault_file_blobs;
create trigger vault_blobs_enforce_quota
  before insert on public.vault_file_blobs
  for each row execute function public.vault_quotas_enforce_limit();
```

**Justificativa:** D8.1 — race condition fix. App valida em prepareUpload, mas 2 uploads paralelos podem ambos passar e estourar limite. Trigger BEFORE INSERT é fim de linha. Erro `vault_quota_exceeded` é capturado pela Server Action que retorna `fail('quota')`.

### 2.9. Reload schema cache

```sql
notify pgrst, 'reload schema';
```

---

## 3. Worker B — Migration `0006_db_hardening_part2.sql`

Escopo: audit log particionado + RLS para tabelas novas + storage policies + pg_cron jobs. Edge Functions ficam em arquivos separados (`supabase/functions/*`).

### 3.1. Cabeçalho

```sql
-- ─── 0006_db_hardening_part2 ───────────────────────────────────────
-- Endurecimento parte 2/2: audit log particionado, RLS para tabelas
-- novas (0005), policies de storage com mime allowlist, pg_cron jobs
-- de purge.
--
-- Origem: docs/db-research.md §4 + §5 + §6 + docs/db-design-principles.md
--         (P3, P4, P6, P10)
--
-- Edge Functions associadas em supabase/functions/storage-cleanup-on-blob-delete/
-- e supabase/functions/audit-event-cleanup/
-- ───────────────────────────────────────────────────────────────────
```

### 3.2. RLS para `vault_classifier_overrides` (P7/D7.3)

```sql
alter table public.vault_classifier_overrides enable row level security;

drop policy if exists "vault_classifier_overrides_owner" on public.vault_classifier_overrides;
create policy "vault_classifier_overrides_owner"
  on public.vault_classifier_overrides for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

### 3.3. Audit log particionado (P4/D4.1-D4.6, decisão B diferenciada)

```sql
-- Tabela mãe (particionada por mês via PARTITION BY RANGE)
create table public.vault_audit_events (
  id              bigserial,
  created_at      timestamptz not null default now(),
  actor_user_id   uuid references auth.users(id) on delete set null,
  event_class     text        not null check (event_class in ('security','access','crud')),
  event_type      text        not null,
  entity_type     text,
  entity_id       uuid,
  before_data     jsonb,
  after_data      jsonb,
  meta            jsonb       not null default '{}'::jsonb,
  retention_until timestamptz not null,
  primary key (id, created_at)
) partition by range (created_at);

-- Função pra calcular retention conforme event_class
create or replace function public.vault_audit_compute_retention(p_class text)
returns timestamptz
language sql
immutable
set search_path = pg_temp
as $$
  select case p_class
    when 'security' then now() + interval '24 months'
    when 'access'   then now() + interval '12 months'
    when 'crud'     then now() + interval '6 months'
    else                 now() + interval '12 months'
  end;
$$;

-- Default trigger: se INSERT não setou retention_until, calcula
create or replace function public.vault_audit_set_retention()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.retention_until is null then
    new.retention_until := public.vault_audit_compute_retention(new.event_class);
  end if;
  return new;
end;
$$;

drop trigger if exists vault_audit_set_retention on public.vault_audit_events;
create trigger vault_audit_set_retention
  before insert on public.vault_audit_events
  for each row execute function public.vault_audit_set_retention();

-- Cria as primeiras 3 partições (mês atual + 2 futuros)
do $$
declare
  m int;
  start_date date;
  end_date date;
  partition_name text;
begin
  for m in 0..2 loop
    start_date := date_trunc('month', now() + make_interval(months => m))::date;
    end_date := date_trunc('month', now() + make_interval(months => m + 1))::date;
    partition_name := format('vault_audit_events_%s', to_char(start_date, 'YYYY_MM'));

    execute format(
      'create table if not exists public.%I partition of public.vault_audit_events for values from (%L) to (%L)',
      partition_name, start_date, end_date
    );
  end loop;
end $$;

-- Index pra query por actor + tempo (mais comum)
create index if not exists vault_audit_events_actor_time
  on public.vault_audit_events (actor_user_id, created_at desc);

-- Index pra purge eficiente
create index if not exists vault_audit_events_retention
  on public.vault_audit_events (retention_until);

-- RLS: usuário vê só seus eventos; service role escreve tudo
alter table public.vault_audit_events enable row level security;

drop policy if exists "vault_audit_events_owner_select" on public.vault_audit_events;
create policy "vault_audit_events_owner_select"
  on public.vault_audit_events for select
  to authenticated
  using (actor_user_id = auth.uid());

-- INSERT: nenhuma policy → só service role (security definer functions)
```

### 3.4. Triggers de audit em vault_files (P4/D4.3)

```sql
create or replace function public.vault_files_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_event_type text;
  v_event_class text;
  v_before jsonb;
  v_after jsonb;
begin
  -- Determina tipo
  if (tg_op = 'INSERT') then
    v_event_type := 'file_create';
    v_event_class := 'crud';
    v_before := null;
    v_after := to_jsonb(new);
  elsif (tg_op = 'UPDATE') then
    -- Soft-delete = evento separado
    if (old.deleted_at is null and new.deleted_at is not null) then
      v_event_type := 'file_soft_delete';
    elsif (old.deleted_at is not null and new.deleted_at is null) then
      v_event_type := 'file_restore';
    elsif (old.system_category_slug is distinct from new.system_category_slug
        or old.user_category_id is distinct from new.user_category_id) then
      v_event_type := 'file_recategorize';
    else
      v_event_type := 'file_update';
    end if;
    v_event_class := 'crud';
    v_before := to_jsonb(old);
    v_after := to_jsonb(new);
  elsif (tg_op = 'DELETE') then
    v_event_type := 'file_hard_delete';
    v_event_class := 'crud';
    v_before := to_jsonb(old);
    v_after := null;
  end if;

  insert into public.vault_audit_events (
    actor_user_id, event_class, event_type, entity_type, entity_id, before_data, after_data
  ) values (
    coalesce((case when tg_op = 'DELETE' then old.user_id else new.user_id end), null),
    v_event_class,
    v_event_type,
    'vault_file',
    coalesce((case when tg_op = 'DELETE' then old.id else new.id end), null),
    v_before,
    v_after
  );

  return coalesce(new, old);
end;
$$;

drop trigger if exists vault_files_audit on public.vault_files;
create trigger vault_files_audit
  after insert or update or delete on public.vault_files
  for each row execute function public.vault_files_audit_trigger();
```

**Eventos manuais (não cobertos por trigger)** ficam responsabilidade da Server Action — `getDownloadUrl` insere um evento `event_class='access', event_type='file_download'` antes de retornar a URL.

### 3.5. Storage bucket — mime allowlist (P6/D6.1)

```sql
-- Atualiza bucket existente com allowed_mime_types fechada
update storage.buckets
set allowed_mime_types = array[
  -- Documentos
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  -- docx
  'application/vnd.oasis.opendocument.text',  -- odt
  'text/plain',
  'text/markdown',
  'application/rtf',
  -- Planilhas
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  -- xlsx
  'application/vnd.oasis.opendocument.spreadsheet',  -- ods
  'text/csv',
  -- Apresentações
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',  -- pptx
  -- Imagens
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/tiff',
  'image/bmp',
  -- Email
  'message/rfc822',  -- eml
  'application/vnd.ms-outlook',  -- msg
  -- Arquivos compactados
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  -- Saúde (DICOM)
  'application/dicom',
  -- Dados estruturados
  'application/json',
  'application/xml',
  'text/xml',
  'application/x-yaml'
]
where id = 'vault';
```

**Justificativa:** D6.1 — defesa em camada Storage. Lista positiva fechada espelha `ALLOWED_EXTENSIONS_HINT` em `validation.ts`. Mime novo = 1-line migration.

### 3.6. pg_cron jobs (E — pg_cron)

**Pré-requisito:** habilitar extensão.

```sql
create extension if not exists pg_cron;
```

**Job 1: purge soft-deleted após retention do tier (P3/D3.1)**

```sql
create or replace function public.vault_files_purge_soft_deleted()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  with deletable as (
    select f.id
    from public.vault_files f
    join public.vault_quotas q on q.user_id = f.user_id
    join public.vault_tiers t on t.slug = q.tier
    where f.deleted_at is not null
      and f.deleted_at < now() - make_interval(days => t.trash_retention_days)
  ),
  deleted as (
    delete from public.vault_files
    where id in (select id from deletable)
    returning id
  )
  select count(*) into v_count from deleted;
  return v_count;
end;
$$;

select cron.schedule(
  'vault_purge_soft_deleted',
  '0 3 * * *',  -- todo dia às 3am UTC
  $$select public.vault_files_purge_soft_deleted();$$
);
```

**Job 2: purge pending após 60min (P3/D3.4 — meu C2)**

```sql
create or replace function public.vault_files_purge_pending()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
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

select cron.schedule(
  'vault_purge_pending',
  '*/15 * * * *',  -- a cada 15min
  $$select public.vault_files_purge_pending();$$
);
```

**Job 3: purge audit events expirados (P4/D4.5)**

```sql
create or replace function public.vault_audit_purge_expired()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  with deleted as (
    delete from public.vault_audit_events
    where retention_until < now()
    returning id
  )
  select count(*) into v_count from deleted;
  return v_count;
end;
$$;

select cron.schedule(
  'vault_audit_purge_expired',
  '0 4 * * *',  -- todo dia às 4am UTC
  $$select public.vault_audit_purge_expired();$$
);
```

**Job 4: criar nova partição mensal de audit events**

```sql
create or replace function public.vault_audit_create_next_partition()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  start_date date;
  end_date date;
  partition_name text;
begin
  -- Cria partição do mês +2 (sempre tem 2 meses de buffer)
  start_date := date_trunc('month', now() + interval '2 months')::date;
  end_date := date_trunc('month', now() + interval '3 months')::date;
  partition_name := format('vault_audit_events_%s', to_char(start_date, 'YYYY_MM'));

  execute format(
    'create table if not exists public.%I partition of public.vault_audit_events for values from (%L) to (%L)',
    partition_name, start_date, end_date
  );
end;
$$;

select cron.schedule(
  'vault_audit_create_partition',
  '0 0 1 * *',  -- dia 1 de cada mês meia-noite UTC
  $$select public.vault_audit_create_next_partition();$$
);
```

### 3.7. Edge Functions (E — TypeScript)

**Function 1: `supabase/functions/storage-cleanup-on-blob-delete/index.ts`**

Trigger: webhook DB do Supabase em DELETE de `vault_file_blobs`. Remove o `storage_path` correspondente.

```typescript
// Pseudo-spec; implementação fica para Worker B
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const { record: oldRecord } = await req.json()
  const { storage_path } = oldRecord

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase.storage.from('vault').remove([storage_path])
  if (error) {
    console.error(`Failed to remove ${storage_path}:`, error)
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }))
})
```

**Function 2: `supabase/functions/audit-download-event/index.ts`**

Helper invocado por Server Action `getDownloadUrl` para registrar evento `access/file_download`. Alternativa: a Server Action mesma faz o INSERT com service role. Decisão pendente Worker B (provavelmente segunda opção, mais simples).

---

## 4. RLS test plan (P10/D10.1-D10.4)

Worker B também cria `src/test/rls/vault.spec.ts`:

```typescript
// Pseudo-spec
describe('Vault RLS isolation', () => {
  let userA: User, userB: User

  beforeAll(async () => {
    userA = await createTestUser()
    userB = await createTestUser()
  })

  test('User B cannot SELECT User A files', async () => {
    const fileId = await uploadAsUser(userA, 'doc.pdf')
    const supabaseAsB = await signInAs(userB)
    const { data, error } = await supabaseAsB
      .from('vault_files').select('*').eq('id', fileId).maybeSingle()
    expect(data).toBeNull()
  })

  test('User B cannot UPDATE User A files', async () => { /* ... */ })
  test('User B cannot DELETE User A files', async () => { /* ... */ })
  test('User B cannot read storage object of User A', async () => { /* ... */ })
  test('User B cannot insert vault_classifier_overrides for User A', async () => { /* ... */ })
  test('User B cannot SELECT User A audit events', async () => { /* ... */ })
})
```

Roda contra Supabase local CLI.

---

## 5. Migration path (sequenciamento)

Ordem de execução **obrigatória**:

```
1. Worker A produz 0005_db_hardening_part1.sql
2. Aplicar 0005 contra Supabase local: supabase db reset
3. Worker B produz 0006_db_hardening_part2.sql + edge functions
4. Aplicar 0006: supabase db push (já com 0005 aplicada)
5. Deploy edge functions: supabase functions deploy storage-cleanup-on-blob-delete
6. Configurar webhook DB: vault_file_blobs DELETE → storage-cleanup edge fn
7. Rodar suite de RLS tests: passar 100%
8. Code-side: atualizar Server Action getDownloadUrl pra inserir audit event
9. Atualizar docs/schema.md, docs/vault/security.md, docs/vault/api.md
10. PR pra merge em dev (NÃO main, conforme requisito do usuário)
```

### 5.1 Webhook: `vault_file_blobs` DELETE → `storage-cleanup-on-blob-delete`

Postgres não dispara HTTP nativo para Edge Functions. Use **Database Webhooks** (Dashboard → Database → Webhooks) ou a API equivalente:

- **Table:** `public.vault_file_blobs`
- **Events:** Delete
- **HTTP Request:** URL da função deployada (`…/functions/v1/storage-cleanup-on-blob-delete`), método POST, corpo JSON no formato do webhook (inclui `type`, `table`, `old_record` com `storage_path`).
- **Secrets:** configure cabeçalhos conforme a doc de Webhooks do Supabase (ex.: `Authorization` com secret de invocação), sem commitar chaves em migrations.

---

## 6. Rollback plan

Pré-launch, rollback é trivial:
- `supabase db reset` reaplica 0001-0004 (e ignora 0005-0006)
- Storage policies em 0006 podem ser revertidas manualmente
- Edge functions desativam via dashboard

Pós-launch (futuro), rollback exige plano per-migration. Doc futuro `docs/db-rollback-runbook.md`.

---

## 7. Cross-reference final

Mapeamento de cada alteração para princípio + decisão + finding:

| Alteração | Princípio | Decisão | Finding |
|---|---|---|---|
| `vault_tiers` (NEW) | P8 | D8.3 | — |
| `vault_classifier_overrides` (NEW) | P7 | D7.1-6 | F01 + C1 |
| CHECK em `original_name` | P1 | D1.1 | M4 |
| CHECK em `text_content` size | P1 | D1.2 | M5 |
| CHECK em `vault_categories.label/slug` | P1 | D1.3, D1.5 | — |
| CHECK em `vault_tags.label/slug` | P1 | D1.4, D1.6 | — |
| CHECK em mime/extension | P1 | D1.7-8 | — |
| `content_sha256` denormalizado + UNIQUE | P2 | D2.1 | — |
| Trigger version_limit por tier | P2 | D2.2 | — |
| `set_updated_at` com search_path | P5 | D5.1 | M1 |
| Triggers quota com search_path | P5 | D5.2-3 | M1 |
| `vault_blobs_quota_enforce` BEFORE INSERT | P8 | D8.1 | — |
| RLS `vault_classifier_overrides` | P7 | D7.3 | F01 |
| `vault_audit_events` particionada | P4 | D4.1-6 | — |
| Trigger audit em vault_files | P4 | D4.3 | — |
| Storage allowed_mime_types | P6 | D6.1 | M2 |
| pg_cron purge soft-deleted | P3 | D3.1 | — |
| pg_cron purge pending | P3 | D3.4 | C2 |
| pg_cron purge audit expired | P4 | D4.5 | — |
| pg_cron criar partição mensal | P4 | D4.1 | — |
| Edge fn storage cleanup | P3 | D3.2 | — |
| RLS test suite | P10 | D10.1-4 | — |
| `getFile` filtra deleted_at | P3 | D3.3 | F02 |

24 alterações, todas justificadas e rastreáveis.

---

## 8. O que NÃO entra nesta migration (deferido)

- **F03** (`.eq` após `.upsert` em updateMetadata): bug de aplicação, não schema. Vai pro vault hardening fase 2.
- **F04** (docs vault/api.md staleness): docs separadamente.
- **F05** (index dedicado em current_blob_id): sem evidência de bottleneck. Adicionar quando métrica mostrar.
- **F06** (vault_system_categories `using true`): intencional, documentar inline em DDL.
- **F07** (profiles unused): manter, sem ação.
- **Outras features de vault** (busca avançada, sharing, OCR, anonimização) — fora do escopo desta etapa.

---

## Próximo passo (Wave 4)

Produzir 2 prompts copy-paste para Cursor workers (A + B), com base neste documento, executados em paralelo. Cada um vai:
- Criar a migration SQL especificada
- Aplicar local + verificar
- Commitar + push
