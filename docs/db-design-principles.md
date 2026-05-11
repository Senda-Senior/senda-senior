# DB Design Principles — Wave 2

**Branch:** `chore/db-hardening`
**Data:** 2026-05-11
**Pré-requisitos:** [docs/db-audit.md](db-audit.md) (auditoria do estado atual), [docs/db-research.md](db-research.md) (fontes consultadas).

**Propósito:** traduzir as fontes da Wave 1 e os achados da auditoria em **princípios de design** específicos pro nosso schema, cada um com decisões concretas de DDL/policy/job que vão à Wave 3.

Cada princípio é numerado (P1-P10) e referenciado pelo schema-alvo da Wave 3.

---

## Filosofia geral

O schema é a **encosta de proteção** do produto. App pode ter bug, pode mudar, pode ser reescrita. O banco precisa garantir que dado nunca corrompa, nunca vaze entre tenants, nunca acumule lixo, nunca assuma estado impossível.

O critério de Stonebraker: **a correção de cada invariante de domínio é responsabilidade do banco**. App valida pra UX (mensagens claras, feedback rápido). Banco valida pra correção (não-negociável, defesa final).

Tudo abaixo deriva disso.

---

## P1 — Defesa em profundidade (5 camadas, não 2)

**Princípio:** toda escrita sensível atravessa 5 camadas independentes. Falha de 1 camada não compromete o sistema. Hoje temos ~3.

**Camadas:**

```
1. UI/Cliente:        validação UX (zod, formato, máscaras)
2. Server Action:     re-validação + autorização (zod + requireUser + assertSameOrigin)
3. RLS:               isolamento tenant (auth.uid() = user_id)
4. CHECK + FK:        invariantes de domínio (status, ranges, FKs cascade)
5. Triggers:          invariantes derivadas (search_vector, quotas, audit)
```

**Estado atual:**
- ✅ Camadas 1, 2, 3 razoáveis
- ⚠️ Camada 4 incompleta (sem CHECK em `original_name`, `text_content`, faltam constraints derivadas)
- ⚠️ Camada 5 sem audit; quotas OK mas pending cleanup ausente

**Decisões concretas pra Wave 3:**

| Decisão | Onde |
|---|---|
| D1.1 | CHECK length em `vault_files.original_name` (1..255) |
| D1.2 | CHECK length em `vault_files.text_content` (≤ 10MB ou particionar) |
| D1.3 | CHECK em `vault_categories.label` (1..64) |
| D1.4 | CHECK em `vault_tags.label` (1..64) |
| D1.5 | CHECK em `vault_categories.slug` formato `^[a-z0-9_-]+$` |
| D1.6 | CHECK em `vault_tags.slug` mesmo formato |
| D1.7 | CHECK em `vault_file_blobs.mime_type` formato `type/subtype` |
| D1.8 | CHECK em `vault_file_blobs.extension` (≤ 16 chars, lowercase) |

> _Origem: princípio universal "constraints no banco" — [Wave 1 §1.2](db-research.md#12-constraints-no-banco-não-na-app)._

---

## P2 — Imutabilidade do conteúdo (CAS canônico)

**Princípio:** blob é imutável. Sha256 É a identidade do conteúdo. Mesmo conteúdo no mesmo usuário = uma única linha de blob. Documento é a entidade lógica que aponta para blob (versão atual). Histórico é blob com `version > 0`.

**Estado atual:** modelo 0004 acerta o split (vault_files = lógica, vault_file_blobs = física), mas:
- ❌ Sem `UNIQUE (user_id, sha256)` no nível do `vault_files` — dois files distintos podem apontar pro mesmo conteúdo via `current_blob_id` diferentes
- ❌ Blobs antigos (versões 1..N-1 quando current = N) acumulam sem política de retenção
- ❌ Pendência: o que acontece com `current_blob_id` quando se faz "rollback de versão"? Hoje a app não suporta, mas o schema tem que prever ou bloquear

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D2.1 | `vault_files`: adicionar `content_sha256` denormalizado (= sha256 do current_blob), com trigger sync, e `UNIQUE (user_id, content_sha256) WHERE deleted_at IS NULL` |
| D2.2 | Cron job mensal: `DELETE FROM vault_file_blobs WHERE version < (SELECT MAX(version) FROM vault_file_blobs b2 WHERE b2.file_id = vault_file_blobs.file_id) - 5` (mantém 5 versões) — configurável |
| D2.3 | Storage cleanup: edge function escutar DELETE em vault_file_blobs e remover objeto correspondente |

> _Origem: [Wave 1 §3 — CAS canônico](db-research.md#3-cas--content-addressable-storage-para-vault-de-documentos)._

**Trade-off explícito:** D2.2 limita histórico a 5 versões. Alternativa = todas. Discussão na Wave 3 com você.

---

## P3 — Soft-delete + purge cron (LGPD-compliant)

**Princípio:** `deleted_at` marca pra recuperação rápida (lixeira). Após `N` dias, **purge físico** ocorre via cron. Sem purge, soft-delete viola LGPD Art. 18 (direito de eliminação).

**Estado atual:**
- ✅ `vault_files.deleted_at` existe e é filtrado em todas as queries (exceto `getFile` — F02 do audit)
- ❌ NENHUM cron de purge — dado fica para sempre
- ⚠️ `validation.ts:18` declara `trashRetentionDays: 30` mas nada o aplica

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D3.1 | Cron job (Supabase scheduled function ou pg_cron): `DELETE FROM vault_files WHERE deleted_at IS NOT NULL AND deleted_at < now() - interval '30 days'` |
| D3.2 | Edge function reativa em DELETE de vault_files: limpa storage objects órfãos do bucket |
| D3.3 | Corrigir `getFile` para filtrar `deleted_at IS NULL` (alinhar com F02) |
| D3.4 | Cron secundário: `DELETE FROM vault_files WHERE status = 'pending' AND created_at < now() - interval '60 minutes'` (resolve C2 da minha auditoria — uploads abandonados) |

> _Origem: [Wave 1 §5 — Soft-delete vs partition + LGPD](db-research.md#5-soft-delete-vs-partition-retention--lgpd)._

---

## P4 — Audit log particionado por tempo

**Princípio:** toda ação sensível gera evento append-only. Eventos vivem em tabela particionada por mês, com retenção de 12 meses (configurável). Trigger-based onde possível, action-injetado para eventos invisíveis ao DB (download).

**Estado atual:** ZERO audit. `vault_access_log` existia em 0002, foi dropado em 0004. `docs/vault/security.md` reconhece como pendência.

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D4.1 | Tabela `vault_audit_events` (particionada por mês via pg_partman OU manual com partições mensais) |
| D4.2 | Schema: `(id bigserial, created_at timestamptz, actor_user_id uuid, entity_type text, entity_id uuid, action text, before jsonb, after jsonb, meta jsonb)` |
| D4.3 | Triggers em `vault_files` (INSERT/UPDATE/DELETE) escrevem auto |
| D4.4 | Server Actions (`getDownloadUrl`, `prepareUpload`) inserem manual pra eventos não-DB |
| D4.5 | Retenção: 12 meses default, drop partitions automático |
| D4.6 | RLS: `actor_user_id = auth.uid()` para SELECT (usuário vê só seus eventos); admin precisa service role |

> _Origem: [Wave 1 §4 — Audit log temporal em Postgres](db-research.md#4-audit-log--event-sourcing-em-postgres)._

---

## P5 — `SET search_path` em TODAS as funções

**Princípio:** mesmo funções não-DEFINER setam `search_path` explicitamente. Custo zero, defense-in-depth absoluta, previne futura promoção pra DEFINER causar exploit.

**Estado atual:** 4 das 7 funções não setam search_path.

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D5.1 | Recriar `set_updated_at` com `SET search_path = pg_temp` (não usa nada além de `now()` e referência a NEW) |
| D5.2 | Recriar `vault_files_quota_trigger` com `SET search_path = public, pg_temp` |
| D5.3 | Recriar `vault_blobs_quota_trigger` com mesmo |
| D5.4 | Recriar `vault_file_blobs_sync_version_count` com mesmo |

> _Origem: [Wave 1 §2 — CVE-2018-1058 + best practices](db-research.md#2-postgres-security-definer--search_path--cve-2018-1058)._

---

## P6 — Storage como camada de proteção real, não só convenção

**Princípio:** o bucket Storage NÃO confia na app. Limita size, mime type, e isolation por path no nível Supabase Storage, antes de chegar a qualquer Server Action.

**Estado atual:**
- ✅ Path policy: primeiro folder = `auth.uid()::text` (correto)
- ✅ `file_size_limit: 50MB` no bucket
- ❌ `allowed_mime_types: null` — qualquer mime entra. Se signed URL vazar ou for gerada fora do app, malicioso pode subir `.exe`

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D6.1 | Bucket `vault`: setar `allowed_mime_types` com lista positiva (PDF, DOCX, JPG, PNG, etc) — espelha `ALLOWED_EXTENSIONS_HINT` da `validation.ts` mas em lista fechada |
| D6.2 | Avaliar adicionar Storage policy bloqueando arquivos sem mime conhecido (defesa redundante — se D6.1 já filtra, isso é zero-cost) |

> _Origem: [Wave 1 §6 — Defense in depth Supabase](db-research.md#6-rls-performance-em-multi-tenant) + auditoria nossa M2/M4._

**Trade-off:** lista fechada de mimes pode bloquear formato legítimo futuro. Mitigação: lista revisável; adicionar mime novo = 1-line migration.

---

## P7 — Tabelas faltantes: `vault_classifier_overrides`

**Princípio:** código nunca pode referenciar tabela inexistente. F01 do audit (CRITICAL) precisa resolver.

**Estado atual:** referenciada em `actions.ts` (upsert + select), tipos manuais em `types.ts`, mas tabela não existe.

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D7.1 | Criar tabela `vault_classifier_overrides`: `(user_id uuid, pattern text, category_slug text, weight int, match_count int, last_matched_at timestamptz, created_at timestamptz, updated_at timestamptz, PRIMARY KEY (user_id, pattern))` |
| D7.2 | FK `category_slug` → `vault_system_categories(slug) ON DELETE CASCADE` |
| D7.3 | RLS: 1 policy FOR ALL `user_id = auth.uid()` |
| D7.4 | CHECK `weight > 0`, `match_count >= 0`, `length(pattern) BETWEEN 1 AND 256` |
| D7.5 | Index `(user_id, last_matched_at DESC)` para ordering por recência |
| D7.6 | Trigger `set_updated_at` |

> _Origem: F01 (Cursor) + minha C1 + [Wave 1 §8](db-research.md#8-ml-feedback-loops--persistência-de-overrides)._

---

## P8 — Limites superiores e governança de quota

**Princípio:** quotas têm que ser monotônicas e claras. Tier define teto. Sistema previne ultrapassagem em duas camadas (Server Action + trigger BEFORE INSERT).

**Estado atual:** quota é checada em `prepareUpload` (Server Action), recalculada por trigger AFTER. Mas não há barreira HARD no banco — race condition: 2 uploads paralelos podem ambos passar a checagem e estourar o limite por alguns bytes.

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D8.1 | Trigger BEFORE INSERT/UPDATE em `vault_file_blobs` que verifica `vault_quotas.used_bytes + NEW.size_bytes <= limit_bytes`, RAISE EXCEPTION se estourar |
| D8.2 | Migration adiciona `vault_quotas` defaults por tier num lookup (`vault_tiers`) — hoje hardcoded 524288000 |
| D8.3 | Tabela `vault_tiers (slug pk, label, limit_bytes, file_count_limit)` para configurar tiers sem DDL |

> _Origem: [Wave 1 §1.2 — defense-in-depth](db-research.md#12-constraints-no-banco-não-na-app)._

**Trade-off:** D8.1 adiciona overhead (1 query por insert). Para vault de baixa concorrência, OK. Pra escala futura, talvez seja repensar.

---

## P9 — Migration discipline: 0005 como reset, 0006+ additive-only

**Princípio:** pré-launch temos liberdade. Pós-launch, discipline. Estabelecemos a regra agora, antes de precisar.

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D9.1 | Migration **0005** vai resetar/corrigir tudo (drop + recreate where breaking) — última janela |
| D9.2 | Migrations **0006+** são additive-only: `ALTER TABLE ADD COLUMN`, `CREATE INDEX CONCURRENTLY`, `ALTER TABLE ADD CONSTRAINT NOT VALID + VALIDATE` |
| D9.3 | Cada migration tem header: propósito, breaking?, requer downtime?, depende de qual app version? |
| D9.4 | Atualizar `docs/conventions.md` com seção "Database migrations: discipline" |

> _Origem: [Wave 1 §7 — Migration discipline](db-research.md#7-migration-discipline-pré-launch-vs-pós-launch)._

---

## P10 — Testes RLS automatizados

**Princípio:** RLS é só correta se foi testada autenticando como usuários distintos. "Testing RLS is notoriously difficult" — exatamente por isso é o que mais quebra silenciosamente.

**Estado atual:** zero teste de RLS. `actions.test.ts` existe mas testa lógica, não policies.

**Decisões concretas:**

| Decisão | Onde |
|---|---|
| D10.1 | Criar `src/test/rls/vault.spec.ts` com setup: 2 users (A, B), A faz upload, B tenta `select`/`download` → deve falhar |
| D10.2 | Testar storage policy: B tenta acessar `{user_a_id}/...` → 403 |
| D10.3 | Testar policy de `vault_classifier_overrides` (após D7) |
| D10.4 | Rodar testes contra Supabase local (CLI já está configurado) |

> _Origem: [Wave 1 §6 — Testing RLS](db-research.md#6-rls-performance-em-multi-tenant)._

---

## Matriz de findings → princípios

Cross-reference: cada finding da auditoria mapeia para um princípio.

| Finding | Origem | Princípio | Decisão |
|---|---|---|---|
| F01 (vault_classifier_overrides) | Cursor + Claude C1 | P7 | D7.1-D7.6 |
| F02 (getFile sem deleted_at) | Cursor | P3 | D3.3 |
| F03 (.eq após .upsert) | Cursor | (app code, fora schema) | revisar em vault hardening fase 2 |
| F04 (docs vault/api.md staleness) | Cursor | (docs) | atualizar após Wave 4 |
| F05 (sem index dedicado current_blob_id) | Cursor | (perf, monitorar) | adiar |
| F06 (vault_system_categories USING true) | Cursor | (intencional) | documentar em DDL |
| F07 (profiles unused) | Cursor | (futuro) | manter |
| C2 (pending cleanup) | Claude | P3 | D3.4 |
| M1 (search_path) | Claude | P5 | D5.1-D5.4 |
| M2 (allowed_mime_types) | Claude | P6 | D6.1 |
| M3 (0004 destrutiva) | Claude | P9 | D9.1-D9.4 (estabelecer discipline) |
| M4 (original_name length) | Claude | P1 | D1.1 |
| M5 (text_content size) | Claude | P1 | D1.2 |

---

## Decisões abertas pra discutir com você (Wave 3 input)

**A. Histórico de versões de blobs (P2/D2.2)**
- Opção 1: manter as 5 últimas versões automaticamente, descartar resto
- Opção 2: manter TODAS as versões para sempre (CAS canônico, mas storage cresce)
- Opção 3: configurável por tier (free=1, premium=10, enterprise=todas)

**B. Audit log retenção (P4/D4.5)**
- Opção 1: 12 meses
- Opção 2: 6 meses (LGPD-friendly mais conservador)
- Opção 3: configurável por user (LGPD self-service)

**C. Tier system (P8/D8.3)**
- Opção 1: 3 tiers fixos (free=500MB, premium=10GB, enterprise=100GB)
- Opção 2: tabela `vault_tiers` mas só seedar 3 — flexibilidade pra futuro
- Opção 3: sem tier system, todos same limit (simplifica MVP)

**D. Storage policy mime allowlist (P6/D6.1)**
- Opção 1: lista positiva fechada (PDF, DOCX, JPG, PNG, JPEG, HEIC, MD, TXT, CSV, XLS, XLSX, PPT, PPTX, ZIP, EML)
- Opção 2: deny-list (block .exe/.sh/.dll, allow rest)
- Opção 3: nada (status quo, defesa só na app)

**E. Onde executar crons (P3, P4)**
- Opção 1: pg_cron extension (precisa habilitar no Supabase)
- Opção 2: Supabase Edge Functions com schedule
- Opção 3: GitHub Actions cron-style (HTTP post pra endpoint Supabase)

---

## Próximo passo (Wave 3)

Você decide A-E acima → eu produzo `docs/db-target-schema.md` com:
- DDL completo para migration 0005 (e 0006 se separar audit)
- Storage policy modificada
- Cron jobs especificados
- Edge functions listadas
- Migration path documentada
- Testes RLS especificados

Daí divide em prompts de 2 Cursor workers pra Wave 4.
