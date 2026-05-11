# DB Pre-Apply Checklist

**Branch:** `chore/db-hardening`
**Data:** 2026-05-11
**Pré-requisitos:** migrations `0005_db_hardening_part1.sql` + `0006_db_hardening_part2.sql` + edge function + suite RLS já no disco.

**Propósito:** review profundo antes de `supabase db reset`. Cada item abaixo é uma verificação real, não rotina. Lista cobre 11 pontos de atenção identificados na revisão linha-por-linha + gotchas conhecidas de Postgres/Supabase.

Marque cada item como ✅ antes de aplicar.

---

## 0. Pre-flight (ambiente)

- [ ] **Docker Desktop está rodando** (verificar com `docker info`; deve retornar sem erro)
- [ ] **Supabase CLI instalada** (`npx supabase --version` retorna versão)
- [ ] **`supabase login` feito** OU `SUPABASE_ACCESS_TOKEN` exportado (necessário pra deploy de Edge Function)
- [ ] **Branch local em `chore/db-hardening`** (verificar com `git status`)
- [ ] **Working tree limpa** (sem mudanças não-commitadas que possam ser perdidas)
- [ ] **Backup do estado atual feito** se houver dados de teste valiosos: `npx supabase db dump --data-only > /tmp/backup.sql`

---

## 1. SQL review — 0005_db_hardening_part1.sql

### 1.1. Ordem de criação de objetos

- [ ] **`set_updated_at()` é recriado ANTES dos triggers que dependem dele?**
  - ✅ Verificado: `vault_classifier_overrides_updated_at` (linha 57-59) referencia função que JÁ existe em 0004:49 e é recriada em §2.7 linha 66 LATER. PostgreSQL permite criar trigger apontando para função existente. CREATE OR REPLACE em §2.7 não invalida o trigger.
  - **Conclusão:** OK.

- [ ] **`vault_files_sync_content_sha256()` é criada antes do trigger que a referencia?**
  - ✅ Verificado: função em linha 183-198, trigger em linha 200-203. Ordem correta.

- [ ] **`vault_blobs_enforce_version_limit()` referencia `vault_tiers` que foi criado em §2.2?**
  - ✅ Verificado: §2.2 cria `vault_tiers` (linha 16) ANTES de §2.6 que cria a função (linha 207). Ordem OK.

### 1.2. ALTER TABLE ADD CONSTRAINT contra dados existentes

- [ ] **Constraints adicionadas às tabelas EXISTENTES podem falhar se há dados que violam.**
  - `vault_files_original_name_length` (length 1..255)
  - `vault_files_text_content_size` (≤10MB)
  - `vault_categories_label_length`, `vault_categories_slug_format`
  - `vault_tags_label_length`, `vault_tags_slug_format`
  - `vault_file_blobs_mime_format`, `vault_file_blobs_extension_format`
  - **Em `supabase db reset`:** OK, banco é zerado e re-aplicado from scratch.
  - **Em `supabase db push` (apply incremental contra DB com dados):** pode falhar se algum row existente viola constraint.
  - **Decisão:** estamos pré-launch sem dados reais, então `db reset` é safe. Anotar: pós-launch, qualquer ALTER ADD CONSTRAINT precisa `NOT VALID + VALIDATE` em 2 passos.

### 1.3. Regex em CHECK constraints

- [ ] **Verificar regex `^[a-z0-9_-]+$` para slugs.**
  - Aceita: `juridico`, `auto-categoria`, `tag_pessoal`, `123`
  - Rejeita: `Saúde` (maiúscula + acento), `cat egoria` (espaço), `tag.dot` (ponto)
  - Seeds em `vault_system_categories` (juridico, saude, financeiro, trabalho, viagem, imoveis, pessoal, outros) — todos válidos ✅

- [ ] **Verificar regex mime `^[a-z0-9.\-+]+\/[a-z0-9.\-+]+$`**
  - Aceita: `application/pdf`, `image/jpeg`, `application/vnd.ms-excel`, `application/x-7z-compressed`
  - Rejeita: `application/X-foo` (maiúscula), `image\jpeg` (barra errada), `text` (sem `/`)
  - Storage allowlist em 0006:167-199 — todos válidos ✅
  - **NOTA:** mime case-sensitive. Spec ALLOWED da `validation.ts` usa lowercase. Server Action faz `.toLowerCase().trim()` antes de inserir. OK.

- [ ] **CHECK em `vault_file_blobs.extension`: `length BETWEEN 0 AND 16 AND extension = lower(extension)`**
  - Permite string vazia. Compatível com `buildStoragePath` em `storage.ts:11-16` que aceita ext vazia.
  - **NOTA:** caso edge — arquivos sem extensão. Permitido.

### 1.4. Trigger recursion / cascading

- [ ] **`vault_blobs_enforce_version_limit` (AFTER INSERT) faz DELETE — não causa loop?**
  - Trigger é AFTER INSERT only. DELETE dispara AFTER DELETE em vault_file_blobs, que fire:
    - `vault_file_blobs_sync_version_count` (atualiza version_count em vault_files)
    - `vault_blobs_quota_trigger` (recalc quota)
  - Nenhum desses chama de volta `enforce_version_limit` (esse é AFTER INSERT, não fire em DELETE).
  - **Conclusão:** sem loop. Mas: cada upload novo de Free tier dispara N DELETEs + N triggers. Para baixa carga, OK.

- [ ] **`vault_quotas_enforce_limit` (BEFORE INSERT) lê `vault_quotas.used_bytes` — é stale?**
  - O `used_bytes` é atualizado por `vault_blobs_quota_trigger` (AFTER) e `vault_files_quota_trigger`.
  - Antes do INSERT desta linha ser commitada, used_bytes reflete o estado pré-insert (mesma transação não comitada ainda — Postgres MVCC).
  - **Cenário race:** 2 inserts paralelos. Ambos leem mesmo used_bytes. Ambos passam check. Ambos commitam → estouro.
  - **Mitigação:** PostgreSQL serializa AFTER triggers via UPDATE em `vault_quotas`. Mas BEFORE INSERT check NÃO bloqueia o outro insert paralelo. Para garantia real, precisaria de `SELECT FOR UPDATE` em `vault_quotas` dentro da função.
  - **Decisão:** aceitar gap pequeno por enquanto. Server Action de pré-upload já filtra ≥99% dos casos. Race window é centenas de ms.
  - **Follow-up futuro:** adicionar `select used_bytes, limit_bytes ... for update` na função (0007).

### 1.5. UNIQUE INDEX em coluna nullable

- [ ] **`vault_files_user_content_unique` em `(user_id, content_sha256)` WHERE `deleted_at IS NULL AND content_sha256 IS NOT NULL`**
  - Postgres permite múltiplos NULL em UNIQUE INDEX por default. Filtro WHERE remove ainda mais — só rows com sha256 não-null entram no índice.
  - **Cenário:** prepareUpload INSERT vault_files com `current_blob_id = NULL`, `content_sha256 = NULL` (trigger BEFORE INSERT settá NULL → NULL). Não conta no índice. ✅
  - Depois UPDATE current_blob_id, trigger BEFORE UPDATE settá content_sha256 = hash. ENTRA no índice. Se duplicar com row anterior, UNIQUE viola.
  - **Cenário race:** 2 prepareUpload paralelos pra mesmo conteúdo. Ambos passam check de duplicate (banco vazio nesse momento). Ambos inserem com sha256=NULL. Quando ambos UPDATE current_blob_id, o 2º falha na UNIQUE. App retorna `fail('internal')`. **Bug menor de UX** — deveria retornar `fail('duplicate')`. Marcar como Follow-up B.

### 1.6. Funções `SECURITY DEFINER` vs caller

- [ ] **Funções com `SECURITY DEFINER` em 0005?**
  - Nenhuma nova. As 2 existentes (`vault_quotas_recalc`, `handle_new_user`) vêm de 0004 e já têm `set search_path`. ✅

- [ ] **Funções caller em 0005 com `SET search_path`?**
  - `set_updated_at` → `pg_temp` ✅
  - `vault_files_quota_trigger` → `public, pg_temp` ✅
  - `vault_blobs_quota_trigger` → `public, pg_temp` ✅
  - `vault_file_blobs_sync_version_count` → `public, pg_temp` ✅
  - `vault_files_sync_content_sha256` → `public, pg_temp` ✅
  - `vault_blobs_enforce_version_limit` → `public, pg_temp` ✅
  - `vault_quotas_enforce_limit` → `public, pg_temp` ✅
  - **Todas as 7 OK.**

---

## 2. SQL review — 0006_db_hardening_part2.sql

### 2.1. RLS no `vault_classifier_overrides`

- [ ] **`ALTER TABLE ... ENABLE ROW LEVEL SECURITY` (linha 14) é redundante com 0005:61?**
  - Sim, mas Postgres aceita idempotente. ✅ Sem erro.

- [ ] **Policy `vault_classifier_overrides_owner` (FOR ALL): cobre SELECT/INSERT/UPDATE/DELETE?**
  - `using (user_id = auth.uid())` + `with check (user_id = auth.uid())` → todas operações restritas ao próprio usuário. ✅

### 2.2. Audit log particionado

- [ ] **`PARTITION BY RANGE (created_at)` com PK `(id, created_at)` — ordem correta?**
  - PostgreSQL exige que coluna de particionamento esteja no PK quando há particionamento. `created_at` está. ✅

- [ ] **Função `vault_audit_compute_retention` é `STABLE`?**
  - Sim, corrigido pelo Worker B. `now()` é `STABLE`, então a função encapsulando também precisa ser `STABLE` (não `IMMUTABLE`). ✅
  - **NOTA:** se algum dia quiser indexar a função, precisará reescrever sem `now()` (passar timestamp como arg).

- [ ] **Trigger `vault_audit_set_retention` BEFORE INSERT — preenche retention_until se NULL?**
  - Sim, linha 60-62. Permite override manual (passar retention_until explicitamente) e default pelo class. ✅

- [ ] **DO block (linha 72-89) cria partições do mês atual + 2 meses futuros?**
  - Loop `m in 0..2`. Mês atual + +1 + +2. Total 3 partições.
  - Nome: `vault_audit_events_2026_05`, `..._2026_06`, `..._2026_07` (assumindo execução em 2026-05).
  - **CRÍTICO:** se você rodar isso DEPOIS de algum INSERT chegar pra mês não-coberto, INSERT falha. Migration roda atomicamente, então não há inserts ainda. ✅
  - **Manutenção:** cron `vault_audit_create_partition` cria mês +2 todo dia 1. Sempre tem 2 meses de buffer.

### 2.3. Audit trigger em vault_files

- [ ] **Trigger `vault_files_audit` (SECURITY DEFINER) escreve em `vault_audit_events`. Política INSERT em audit?**
  - Não há policy INSERT pra authenticated. Mas trigger é `SECURITY DEFINER` → roda com privilégios do owner (postgres), bypassa RLS. ✅
  - **GAP REAL:** Server Action quer inserir evento `file_download` manual (event_class='access'). Action usa client com JWT do user, RLS aplica, sem policy INSERT → falha.
  - **Decisão pendente (Follow-up A):**
    - a) Adicionar policy `INSERT WITH CHECK (actor_user_id = auth.uid() AND event_class = 'access')` em 0007
    - b) Server Action usa `admin.ts` (service role) pra esses inserts
  - **NÃO BLOQUEIA o reset.** É código futuro.

- [ ] **Trigger captura `INSERT/UPDATE/DELETE`. Quais campos disparam?**
  - INSERT: sempre. ✅
  - UPDATE: sempre (não filtra por colunas específicas). Inclui mudança de `version_count`, `search_vector` (que o trigger search atualiza automaticamente), `content_sha256` (sync trigger). Cada um gera audit event.
  - **CONSEQUÊNCIA:** ~3 audit events por 1 upload lógico (insert + update current_blob_id + sync content_sha256). Noisy mas tudo class='crud'.
  - **Mitigação futura:** filtrar trigger pra `UPDATE OF display_name, description, deleted_at, ...` (campos significativos). Não bloqueia.

### 2.4. Storage bucket UPDATE

- [ ] **UPDATE `storage.buckets` SET allowed_mime_types — bucket existe?**
  - Sim, 0004:113 cria com `on conflict (id) do nothing`. UPDATE em 0006 vai funcionar.
  - **Se bucket não existir (caso edge):** UPDATE afeta 0 rows, silencioso. App vai ter problema separado.

- [ ] **Mimes na allowlist cobrem ALLOWED_EXTENSIONS_HINT da `validation.ts`?**
  - PDF, DOCX, JPG, PNG, HEIC, ZIP, DICOM, EML — todos cobertos.
  - Faltam: `image/heif` ✅ está, `application/x-tar` (faltando — adicionar se quiser .tar? `ALLOWED_EXTENSIONS_HINT` lista 'zip','rar','7z' apenas, não .tar). OK.
  - **Verificar:** lista da app menciona `.json`, `.xml`, `.yaml`, `.yml` → `application/json`, `application/xml`, `text/xml`, `application/x-yaml` ✅ todos presentes.

### 2.5. pg_cron extension + schedules

- [ ] **`CREATE EXTENSION IF NOT EXISTS pg_cron;` — disponível no projeto Supabase?**
  - **MANUAL:** verificar em Supabase Dashboard → Database → Extensions que `pg_cron` está ativada. Free tier suporta. Se não estiver ativada, migration falha aqui.
  - **AÇÃO:** habilitar antes de aplicar.

- [ ] **Schedules cron são UTC?**
  - Sim. `0 3 * * *` = 3am UTC = midnight Brasília. Aceitável (low-load).
  - `*/15 * * * *` = a cada 15min. Para pending cleanup. ✅
  - `0 4 * * *` = 4am UTC. ✅
  - `0 0 1 * *` = dia 1 de cada mês, meia-noite UTC. ✅

- [ ] **`cron.schedule()` permission?**
  - Postgres role `supabase_admin` (usado pelas migrations) tem permission. ✅

### 2.6. Funções SECURITY DEFINER

- [ ] **Funções SECURITY DEFINER em 0006: têm `set search_path`?**
  - `vault_files_audit_trigger` → `public, pg_temp` ✅
  - `vault_files_purge_soft_deleted` → `public, pg_temp` ✅
  - `vault_files_purge_pending` → `public, pg_temp` ✅
  - `vault_audit_purge_expired` → `public, pg_temp` ✅
  - `vault_audit_create_next_partition` → `public, pg_temp` ✅
  - **Todas as 5 OK.**

---

## 3. Cross-file: 0005 + 0006 integração

- [ ] **0006 depende de tabelas criadas em 0005?**
  - `vault_classifier_overrides` (0005) → policy em 0006 ✅
  - `vault_audit_events` é criado em 0006, não 0005.
  - Funções `vault_files_purge_soft_deleted` (0006) usa `vault_tiers` (0005) — ordem 0005→0006 respeitada pelo Supabase CLI. ✅

- [ ] **Aplicar fora de ordem causa quebra?**
  - Sim. Sempre `supabase db reset` (que aplica em ordem) ou `db push` sequencial. ✅

---

## 4. Pós-apply — verificações manuais

Após `supabase db reset` rodar sem erro, verificar (cole no terminal):

```bash
# 4.1. Tabelas novas existem
npx supabase db dump --schema public | Select-String "CREATE TABLE.*vault_tiers"
npx supabase db dump --schema public | Select-String "CREATE TABLE.*vault_classifier_overrides"
npx supabase db dump --schema public | Select-String "CREATE TABLE.*vault_audit_events"

# 4.2. CHECK constraints aplicadas
npx supabase db dump --schema public | Select-String "vault_files_original_name_length"
npx supabase db dump --schema public | Select-String "vault_categories_slug_format"

# 4.3. Functions com search_path
npx supabase db dump --schema public | Select-String -Context 0,4 "CREATE.*FUNCTION.*set_updated_at"

# 4.4. Partições do audit log criadas (3 esperadas)
npx supabase db dump --schema public | Select-String "PARTITION OF vault_audit_events"

# 4.5. Storage bucket tem allowed_mime_types
npx supabase db dump --schema storage | Select-String -Context 0,2 "INSERT INTO storage.buckets"

# 4.6. pg_cron jobs registrados (4 esperados)
npx supabase db dump --schema cron | Select-String "cron.schedule"

# 4.7. Seeds dos tiers
npx supabase db dump --data-only --schema public | Select-String "vault_tiers"
# Esperado: 3 INSERTs (free, premium, enterprise)
```

---

## 5. Passos manuais OBRIGATÓRIOS após aplicar

- [ ] **5.1. Habilitar `pg_cron` no Supabase Dashboard** (se ainda não)
  - Dashboard → Database → Extensions → procurar `pg_cron` → toggle on
  - Se já estava, migration roda OK; se não, migration falha em CREATE EXTENSION (mas se você seguiu o checklist deveria já estar ativada antes do reset)

- [ ] **5.2. Deploy Edge Function `storage-cleanup-on-blob-delete`**
  ```bash
  npx supabase functions deploy storage-cleanup-on-blob-delete
  ```
  Requer `SUPABASE_ACCESS_TOKEN` ou `npx supabase login` antes.

- [ ] **5.3. Configurar Database Webhook em Supabase Dashboard**
  - Dashboard → Database → Webhooks → New Webhook
  - Name: `storage-cleanup-on-blob-delete`
  - Table: `vault_file_blobs`
  - Events: `DELETE`
  - Type: `Supabase Edge Functions` → escolher `storage-cleanup-on-blob-delete`
  - **CRÍTICO:** sem este webhook configurado, storage objects órfãos NÃO são limpos quando blobs são deletados (por trigger ou cron).

- [ ] **5.4. Preencher `.env.test`** (criar a partir de `.env.test.example`)
  - Rodar `npx supabase status` → copiar URL + ANON_KEY + SERVICE_ROLE_KEY
  - Preencher `.env.test` na raiz do projeto
  - **Caso contrário:** RLS test suite vai pular (skip) com `describe.skipIf`

- [ ] **5.5. Rodar suite de testes RLS**
  ```bash
  npm run test src/test/rls/vault.spec.ts
  ```
  Esperado: 6/6 PASS. Se falhar:
  - Test "User B cannot SELECT" → RLS quebrada no SELECT
  - Test "User B cannot UPDATE/DELETE" → RLS quebrada com possível data loss
  - Test "User B cannot storage" → bucket policy quebrada
  - Test "User B cannot insert overrides" → policy `vault_classifier_overrides_owner` quebrada
  - Test "User B cannot SELECT audit" → policy `vault_audit_events_owner_select` quebrada

---

## 6. Follow-ups conhecidos (não bloqueiam apply, viram 0007 ou code-side)

- [ ] **FU-A** Política INSERT em `vault_audit_events` para Server Action inserir manualmente eventos `access` (file_download). Hoje sem policy → action precisa usar admin client OU 0007 adiciona policy `with check (actor_user_id = auth.uid() and event_class = 'access')`.
- [ ] **FU-B** Race condition em upload paralelo do mesmo conteúdo: 2º upload falha em `vault_files_user_content_unique`, retorna `fail('internal')` em vez de `fail('duplicate')`. Pequeno, code-side fix em `actions.ts`.
- [ ] **FU-C** Audit trigger é noisy: gera ~3 eventos por upload lógico (insert + update + sync content_sha256). Pode filtrar UPDATE pra colunas significativas em 0007.
- [ ] **FU-D** `vault_quotas_enforce_limit` tem race window (centenas de ms) — múltiplos uploads paralelos podem estourar limit por bytes. Mitigação: `SELECT FOR UPDATE` em quota dentro da função (0007).
- [ ] **FU-E** Atualizar `src/features/vault/actions.ts` pra capturar `vault_quota_exceeded` raise exception e retornar `fail('quota')` em vez de `fail('internal')`.

---

## 7. Rollback plan

Se `supabase db reset` quebrar no meio:

1. Identificar a linha do erro no output (CLI mostra arquivo + linha)
2. Editar a migration correspondente (0005 ou 0006)
3. `supabase db reset` de novo — Postgres recomeça from scratch toda vez
4. Iterar até verde

Se aplicar deu certo mas testes RLS falharam:

1. Reverter via `git revert <commit-da-migration>` e regenerar migration corrigida
2. OU criar 0007 corrigindo (additive)

Pré-launch, **não há dados reais perdidos** em nenhum cenário — `db reset` é seguro.

---

## 8. Critério de "GO" para o reset

Reset pode rodar quando:

- [✓] §0 todos itens checked
- [✓] §1 e §2 leitura concluída (você confirmou que entendeu as gotchas)
- [✓] §5.1 (pg_cron habilitada) feito

Reset pode esperar para:

- §5.2, §5.3, §5.4, §5.5 — esses são pós-reset
- §6 (follow-ups) — não bloqueiam, viram 0007 depois

---

## 9. Resumo executivo

**Migrations estão SQL-corretas.** Workers A e B fizeram bom trabalho, inclusive catch das 2 ambiguidades reais da spec original.

**Riscos identificados são todos não-bloqueantes:**
- 4 follow-ups code-side (não DDL)
- 2 passos manuais pós-apply (webhook, edge fn deploy)
- 1 pré-requisito (pg_cron extension habilitada)

**Após verificar §0 (especialmente pg_cron ativada), o reset deve passar verde.**
