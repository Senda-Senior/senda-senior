# DB Research — Wave 1

**Branch:** `chore/db-hardening`
**Data:** 2026-05-11
**Propósito:** consolidar fontes autoritativas que vão ancorar a Wave 2 (princípios) e Wave 3 (design alvo). Cada afirmação é amarrada à fonte. Sem palpites.

Toda decisão de schema na Wave 3 vai apontar pra um princípio da Wave 2, que por sua vez aponta pra uma fonte aqui. Cadeia auditável.

---

## 1. Stonebraker — princípios que aplicam aqui

### 1.1. "One size does not fit all"

Stonebraker, 2005 (MIT). Argumento central: a arquitetura DBMS tradicional foi otimizada para business data processing e foi forçada em vários casos de uso com requisitos diferentes. **Postgres é a escolha certa quando a workload é OLTP transacional com dados relacionais; é a escolha errada quando é stream processing, time-series massivo, OLAP analítico puro, ou key-value latência sub-ms.**

Aplicação ao nosso vault: **Postgres + RLS + JSONB + Supabase Storage é a escolha correta**. Nossa workload é:
- OLTP transacional (uploads, leituras, updates)
- Volume modesto (5000 docs/user, milhares de users)
- Multi-tenant com isolamento estrito
- Buscas full-text + filtros estruturados
- Append-mostly com soft-delete

Não é stream, não é OLAP, não é cache. **Postgres cabe.** Nossa decisão hoje é arquitetural certa — agora precisa ser bem implementada.

> _Fonte: ["One Size Does Not Fit All — An Idea Whose Time Has Come and Gone", Stonebraker & Çetintemel, ICDE 2005](https://cs.brown.edu/~ugur/fits_all.pdf), via [síntese KDnuggets 2012](https://www.kdnuggets.com/2012/05/interview-mike-stonebraker-one-size-does-not-fit-all.html)._

### 1.2. Constraints no banco, não na app

Doutrina antiga, reforçada na era ORM. Toda invariante última (que se violada corromperia o domínio) tem que estar em DDL — CHECK, FK, UNIQUE, NOT NULL. App valida UX (mensagens amigáveis), banco valida correção (não-negociável).

Aplicação ao vault: hoje temos zod validando `name.max(255)` mas o banco aceita `text` infinito em `original_name`. Inserção SQL direta (admin script, futuro processo, qualquer coisa que escape o Server Action) corrompe.

---

## 2. Postgres SECURITY DEFINER + search_path — CVE-2018-1058

**Toda função `SECURITY DEFINER` DEVE ter `SET search_path` explícito.** Sem isso, é vulnerabilidade de privilege escalation conhecida.

Mecanismo do ataque: usuário malicioso cria função/operador `public.<algo>` que masca função do `pg_catalog`. A função SECURITY DEFINER, ao executar com privilégios elevados, resolve o nome via search_path e chama a versão maliciosa em vez da legítima. Ataque histórico: usuário virou superuser via operador `+` falso em schema `public`.

> _Fontes: [PostgreSQL wiki — Guide to CVE-2018-1058](https://wiki.postgresql.org/wiki/A_Guide_to_CVE-2018-1058:_Protect_Your_Search_Path); [Cybertec — Abusing SECURITY DEFINER Functions](https://www.cybertec-postgresql.com/en/abusing-security-definer-functions/)._

**Estado atual nosso:**

| Função | SECURITY DEFINER? | `set search_path`? |
|---|---|---|
| `vault_quotas_recalc` | ✅ | ✅ `public, pg_temp` |
| `handle_new_user` | ✅ | ✅ `public, pg_temp` |
| `set_updated_at` | ❌ (caller) | ❌ |
| `vault_files_update_search` | ❌ (caller) | ✅ `public, extensions, pg_temp` |
| `vault_files_quota_trigger` | ❌ (caller) | ❌ |
| `vault_blobs_quota_trigger` | ❌ (caller) | ❌ |
| `vault_file_blobs_sync_version_count` | ❌ (caller) | ❌ |

**Diagnóstico:** as duas SECURITY DEFINER estão OK. As funções de trigger sem search_path NÃO são exploit imediato (rodam com permissão do caller, e em trigger context o search_path já está configurado pelo caller), MAS: best practice é sempre setar explicitamente — defense in depth + previne futura mudança onde alguém promova a função pra SECURITY DEFINER sem revisão.

**Decisão Wave 2:** todas as funções, mesmo não-DEFINER, devem ter `SET search_path = public, pg_temp` (ou `, extensions, pg_temp` se usarem extensões). Custo: 1 linha por função. Ganho: zero risco futuro.

---

## 3. CAS — Content-Addressable Storage para vault de documentos

Vault é literalmente um CAS system. Princípios canônicos:

1. **Conteúdo identifica conteúdo.** O sha256 do blob É o endereço lógico. Modificações geram novo hash → novo objeto. Imutabilidade automática.
2. **Deduplicação grátis.** Mesmo conteúdo = mesmo hash = mesmo objeto. Storage não cresce com uploads duplicados.
3. **Separação lógica vs física.** "Documento" (entidade do usuário) ≠ "Blob" (bytes específicos). Um documento aponta para o blob atual; histórico de blobs é versão.

> _Fontes: [Wikipedia — Content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage); [CAS por Soul Spark](https://medium.com/@soulspark3/what-is-cas-content-addressed-storage-c3cc51bd5b73)._

**Estado atual nosso:** já fazemos quase certo no modelo 0004:

- `vault_files` = entidade lógica (display_name, categoria, tags, metadata)
- `vault_file_blobs` = bytes versionados (storage_path, mime, size, sha256, version)
- `vault_files.current_blob_id` → aponta o blob "vivo"

**Gaps vs CAS canônico:**

1. **`vault_files` não tem `UNIQUE (user_id, sha256)`.** O modelo 0002 tinha; 0004 removeu (porque sha256 mudou pra `vault_file_blobs`). Mas a dedup deveria ser por usuário no nível de **conteúdo**, não no nível de blob. Hoje, dois `vault_files` distintos podem apontar pro mesmo conteúdo se o usuário trocar `current_blob_id`. Decisão: dedup no Server Action é OK, mas constraint no banco fortifica.

2. **Blobs órfãos** (referenciados em `current_blob_id` mas tabela tem outros blobs antigos): hoje não há limpeza. Cada `current_blob_id = X` deixa blobs `version 1..N-1` sem uso. CAS clássico mantém TODAS as versões pra história — está correto. **Mas storage explode**. Decisão de produto: quanto histórico manter?

---

## 4. Audit log / Event sourcing em Postgres

Padrão estabelecido (~150 linhas de SQL no clássico HN post). Princípios:

1. **Append-only.** Eventos nunca atualizam, nunca deletam. Tabela `audit_events` com `id bigserial`, `created_at`, `actor_user_id`, `entity_type`, `entity_id`, `action`, `payload jsonb`, `meta jsonb`.
2. **Trigger-based.** Cada tabela auditada tem trigger `AFTER INSERT/UPDATE/DELETE` que escreve linha em `audit_events`. App não precisa saber.
3. **JSONB pra payload.** Schema-flexible. Permite evolução sem migration.
4. **Retenção via partição por tempo.** `audit_events_2026_05`, `audit_events_2026_06`, etc. Drop partition é instantâneo, vacuum não pesa.

> _Fontes: [Postgres Auditing in 150 lines of SQL — HN](https://news.ycombinator.com/item?id=30615470); [Tigerdata — Audit Logging in PostgreSQL](https://www.tigerdata.com/learn/what-is-audit-logging-and-how-to-enable-it-in-postgresql); [PostgreSQL Trigger-Based Audit Log — Stav Barak](https://medium.com/israeli-tech-radar/postgresql-trigger-based-audit-log-fd9d9d5e412c)._

**Estado atual nosso:** ZERO audit. Migration 0002 tinha `vault_access_log` (action ENUM com upload/download/view/etc, ip, user_agent), 0004 dropou. Doc `vault/security.md` reconhece como pendência ("audit log estruturado pendente").

**Decisão Wave 2:** RE-criar audit log com padrão moderno:
- Tabela `vault_audit_events` particionada por mês (pg_partman ou manual)
- Trigger em `vault_files` (INSERT/UPDATE/DELETE) escreve evento
- Server Actions adicionam eventos manuais pra `download` (não visível por trigger)
- LGPD: retenção configurável (ex: 12 meses), purge automático

---

## 5. Soft delete vs partition retention — LGPD

Soft delete (`deleted_at` timestamp) é universal mas **não atende GDPR/LGPD sozinho**:

- LGPD Art. 18 garante direito de eliminação
- Soft-delete só MARCA, não REMOVE — dado ainda existe no disco
- **Precisa purge job** que hard-delete após retenção

Partition-based retention é mais eficiente em escala mas adiciona complexidade.

> _Fontes: [Postgres soft-delete strategies — DEV.to](https://dev.to/oddcoder/postgresql-soft-delete-strategies-balancing-data-retention-50lo); [Data archiving and retention in PostgreSQL — Data Egret](https://dataegret.com/2025/05/data-archiving-and-retention-in-postgresql-best-practices-for-large-datasets/); [Auto-archiving with pg_partman — Crunchy Data](https://www.crunchydata.com/blog/auto-archiving-and-data-retention-management-in-postgres-with-pg_partman)._

**Decisão Wave 2 pra nós:**
- Vault tem volume modesto (~5000 docs/user, milhares de users) → **soft-delete + purge cron** é suficiente. Particionamento é overkill aqui.
- Audit log é DIFERENTE: alta cardinalidade (1 evento por ação), pode crescer rápido → **particionar por mês**.

---

## 6. RLS performance em multi-tenant

> _Fontes: [Supabase Docs — RLS Performance and Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv); [Makerkit — RLS Best Practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)._

Insights chave:
1. **Index policy columns.** Para `auth.uid() = user_id`, indexar `user_id` dá "100x improvement em tabelas grandes". Hoje temos índice composto `(user_id, deleted_at, created_at desc)` que cobre isso para `vault_files`. ✅
2. **Adicione filtros explícitos.** Mesmo com RLS, queries devem filtrar `where user_id = auth.uid()` — ajuda otimizador a escolher índice. Server Actions nossas já fazem isso. ✅
3. **Evite policies complexas com joins.** Nossas EXISTS subqueries em `vault_file_tags` e `vault_file_blobs` são aceitáveis em volume baixo, mas viram problema acima de ~10k linhas por usuário. Monitorar.
4. **Teste autenticado.** "Testing RLS is notoriously difficult." Precisamos suite de testes RLS — criar 2 usuários, tentar cross-access, esperar falha.

**Decisão Wave 2:** adicionar suite de testes RLS na Worker B.

---

## 7. Migration discipline pré-launch vs pós-launch

Nós estamos **pré-launch** — temos liberdade de DROP e re-criar (foi o que 0004 fez). Pós-launch, **migrations são imutáveis e additive-only**:

- ALTER TABLE ADD COLUMN é seguro (default NULL ou expressão constante)
- ALTER TABLE ADD CONSTRAINT é OK se NOT VALID + VALIDATE depois (zero-downtime)
- DROP COLUMN exige plano (rename + rewrite + drop after deploy)
- Mudança de tipo exige multi-step (add new col, backfill, rename)

> _Fonte: [Supabase Docs — Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations); [Vitalize — From Supabase to PlanetScale: Zero Downtime](https://vitalize.care/blog/from-supabase-to-planetscale)._

**Decisão Wave 2:**
- Aproveitamos esta janela pré-launch pra **fazer migration 0005 que reseta corretamente** (drop + recreate where needed)
- A partir de 0006 em diante, **vira disciplina additive-only** documentada em `docs/conventions.md`
- Estabelecemos convenção: cada migration tem header explicando o porquê, é idempotente, e indica se é breaking ou additive

---

## 8. ML feedback loops — persistência de overrides

Nosso classifier tem `vault_classifier_overrides` (tabela inexistente!) com pattern: usuário corrige categoria → sistema "aprende" via override persistido por usuário.

Padrões de mercado:
- **Per-user feedback** (nosso caso): tabela `(user_id, signal, label, weight, count, created_at)` — escala com tamanho do usuário, isolamento natural por RLS
- **Global feedback**: tabela compartilhada (mais poderoso mas exige privacidade — nem sempre quer enviar pattern de filename pro pool global)
- **Híbrido**: per-user com signal opcional pra promoção a global após threshold

Para v1, **per-user é suficiente**. Promoção a global é feature de produto (com consentimento) que pode vir depois.

**Decisão Wave 2:** criar `vault_classifier_overrides` per-user, com RLS, schema preparado para evolução (campo `weight` pra ajuste fino, `match_count` pra estatística, `last_matched_at` pra recência).

---

## 9. Síntese de fontes consultadas

**Diretas:**
- [Postgres wiki — CVE-2018-1058 Search Path](https://wiki.postgresql.org/wiki/A_Guide_to_CVE-2018-1058:_Protect_Your_Search_Path)
- [Cybertec — Abusing SECURITY DEFINER Functions](https://www.cybertec-postgresql.com/en/abusing-security-definer-functions/)
- [Wikipedia — Content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage)
- [Tigerdata — What Is Audit Logging in PostgreSQL](https://www.tigerdata.com/learn/what-is-audit-logging-and-how-to-enable-it-in-postgresql)
- [Hacker News — Postgres Auditing in 150 lines of SQL](https://news.ycombinator.com/item?id=30615470)
- [Crunchy Data — Auto-archiving with pg_partman](https://www.crunchydata.com/blog/auto-archiving-and-data-retention-management-in-postgres-with-pg_partman)
- [Supabase Docs — RLS Performance and Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- [Makerkit — RLS Best Practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)
- [DEV.to — Postgres soft-delete strategies](https://dev.to/oddcoder/postgresql-soft-delete-strategies-balancing-data-retention-50lo)
- [Data Egret — Data archiving and retention](https://dataegret.com/2025/05/data-archiving-and-retention-in-postgresql-best-practices-for-large-datasets/)
- [Supabase Docs — Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)

**Secundárias (síntese):**
- [KDnuggets — Stonebraker Interview: One Size Does Not Fit All](https://www.kdnuggets.com/2012/05/interview-mike-stonebraker-one-size-does-not-fit-all.html)
- [The New Stack — Stonebraker: A Short History of Database Systems](https://thenewstack.io/dr-michael-stonebraker-a-short-history-of-database-systems/)

---

## Próximo passo (Wave 2)

Sintetizar as Seções 1-8 em **princípios de design aplicáveis ao nosso schema**, com cada princípio amarrado a uma decisão concreta de DDL para Wave 3.

Output esperado: `docs/db-design-principles.md`.
