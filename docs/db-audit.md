# DB Audit — chore/db-hardening

Data: 2026-05-11  
Branch: chore/db-hardening  
Migrations cobertas: 0001 (`0001_user_checklist_items.sql`), 0002 (`0002_vault.sql`), 0003 (`0003_vault_unaccent_fix.sql`), 0004 (`0004_remodel_context_vault.sql`)

**Nota de ordem:** `0004` remove e recria o modelo vault e substitui `user_checklist_items` por `care_checklist_items`. O **schema efetivo em produção** assume **0004 aplicada por último**. Tabelas apenas em `0002` que foram dropadas em `0004` **não** entram no inventário atual.

---

## 1. Inventário de tabelas

Escopo: schema `public` após `0004` (e objetos `storage` citados na §5).

| Tabela | Colunas (count) | PK | FKs | RLS habilitada? | Policies (count) | Triggers |
|--------|-----------------|----|-----|-----------------|------------------|----------|
| `profiles` | 5 | `user_id` | → `auth.users(id)` ON DELETE CASCADE | sim | 1 (`profiles_self_all`, FOR ALL) | 1 (`profiles_updated_at`, BEFORE UPDATE → `set_updated_at`) |
| `care_checklist_items` | 4 | (`user_id`,`item_key`) | → `auth.users(id)` ON DELETE CASCADE | sim | 4 (SELECT / INSERT / UPDATE / DELETE) | 1 (`care_checklist_items_updated_at`, BEFORE UPDATE → `set_updated_at`) |
| `vault_system_categories` | 5 | `slug` | — | sim | 1 (`vault_system_categories_read`, SELECT) | 0 |
| `vault_categories` | 8 | `id` | → `auth.users(id)` ON DELETE CASCADE | sim | 1 (`vault_categories_owner`, FOR ALL) | 0 |
| `vault_tags` | 5 | `id` | → `auth.users(id)` ON DELETE CASCADE | sim | 1 (`vault_tags_owner`, FOR ALL) | 0 |
| `vault_files` | 19 | `id` | → `auth.users`; → `vault_file_blobs(current_blob_id)` ON DELETE SET NULL; → `vault_system_categories(slug)`; → `vault_categories(id)` | sim | 1 (`vault_files_owner`, FOR ALL) | 3 (`vault_files_updated_at` BEFORE UPDATE; `vault_files_search_vector` BEFORE INSERT/UPDATE OF cols; `vault_files_quota_after` AFTER INSERT/UPDATE/DELETE) |
| `vault_file_blobs` | 9 | `id` | → `vault_files(id)` ON DELETE CASCADE | sim | 1 (`vault_file_blobs_owner`, FOR ALL) | 2 (`vault_file_blobs_version_count` AFTER I/U/D; `vault_blobs_quota_after` AFTER INSERT/DELETE/UPDATE OF `size_bytes`) |
| `vault_file_tags` | 2 | (`file_id`,`tag_id`) | → `vault_files`; → `vault_tags` | sim | 1 (`vault_file_tags_owner`, FOR ALL) | 0 |
| `vault_quotas` | 6 | `user_id` | → `auth.users(id)` ON DELETE CASCADE | sim | 1 (`vault_quotas_owner_select`, SELECT apenas) | 1 (`vault_quotas_updated_at`, BEFORE UPDATE → `set_updated_at`) |

**Fora de `public` (relevante ao app):** trigger `on_auth_user_created` em `auth.users` (AFTER INSERT) → `handle_new_user()` (cria `profiles` + `vault_quotas`).

---

## 2. Tabelas REFERENCIADAS pelo código mas NÃO existentes no schema

Pesquisa: `.from('…')` / `.from("…")` em `src/features/**` e `src/lib/**` (PostgREST). Storage usa o mesmo método com **nome de bucket**, não tabela SQL.

| Tabela referenciada | Arquivo:linha | Existe nas migrations? |
|---------------------|---------------|-------------------------|
| `vault_classifier_overrides` | `src/features/vault/actions.ts` (~345 upsert; ~452–456 select) | **Não.** Ausente de `0001`–`0004`. Existe apenas em `src/lib/supabase/types.ts` (tipos manuais). |
| `vault` (bucket Storage) | `src/features/vault/client/upload.ts` (~61) `.from('vault')` | **N/A (não é tabela `public`).** Bucket `vault` criado em `0002` / reafirmado em `0004`. |

Todas as outras relações PostgREST encontradas batem com o DDL pós-`0004`: `care_checklist_items`, `vault_quotas`, `vault_system_categories`, `vault_categories`, `vault_tags`, `vault_files`, `vault_file_blobs`, `vault_file_tags`.

**Call-sites `vault_classifier_overrides`:**

1. `actions.ts`: `upsert` dentro de `updateMetadata` (ramo de override de categoria, quando há `pattern`).
2. `actions.ts`: `loadUserOverrides` — `select` + `order('match_count')`.

**Consequência:** qualquer execução bem-sucedida desses ramos falha no Postgres até existir DDL correspondente (ou até remover o uso).

`src/features/auth/**` e `src/lib/server/auth.ts`: **sem** `.from('table')` — sessão via `supabase.auth.getUser()` / `signOut()`, não via tabelas `public` diretas.

**Tabelas só no banco, não referenciadas em `.from()` no código auditado:** `profiles` (preenchida por `handle_new_user`; app não lê via Supabase client neste grep).

---

## 3. Colunas REFERENCIADAS mas NÃO existentes

Comparação contra DDL em `0004` + uso em `vault/data.ts` (`VAULT_FILE_SELECT`), `vault/actions.ts`, `dashboard/data.ts`, `dashboard/actions.ts`.

| Situação | Detalhe |
|----------|---------|
| Colunas em `VAULT_FILE_SELECT` | Todas existem em `vault_files`, `vault_file_blobs`, `vault_system_categories`, `vault_categories`, `vault_tags`, `vault_file_tags` com os nomes usados (incl. FK hints PostgREST `current_blob`, `system_category`, `user_category`, `tags_join`). |
| `care_checklist_items` | `select('item_key, done')`; `upsert({ user_id, item_key, done })` — colunas existem. |
| `prepareUpload` insert em `vault_files` | `id`, `user_id`, `display_name`, `original_name`, `status` — válidas; demais com default/null permitido. |
| `vault_file_blobs` insert | `file_id`, `version`, `storage_path`, `mime_type`, `extension`, `size_bytes`, `sha256` — válidas. |
| Updates em `vault_files` (`confirmUpload`, `updateMetadata`, soft delete) | `status`, `system_category_slug`, `user_category_id`, `confidence`, `manual_override`, `display_name`, `description`, `favorite`, `deleted_at` — todas no DDL. |

**Discrepância ligada à tabela inexistente**

| Uso | Colunas no código | DDL |
|-----|-------------------|-----|
| `vault_classifier_overrides` upsert/select | `user_id`, `pattern`, `category_slug`, `weight`, `match_count`, `created_at`, `updated_at`; select ordena por `match_count` | **Sem tabela** nas migrations — não aplicável validar colunas no Postgres. |

**Comportamento API cliente:** em `updateMetadata`, encadeamento `await supabase.from('vault_classifier_overrides').upsert(..., { onConflict: 'user_id,pattern' }).eq('user_id', user.id)` — o `.eq` após `upsert` é **suspeito** em uso típico do cliente Supabase (filtros costumam aplicar-se a `select`/`update`/`delete`, não a encadear correção de escopo no `upsert`). Requer revisão de runtime (fora do escopo DDL).

---

## 4. RLS audit por tabela

### `profiles`

| Operação | Qtd | Predicate / WITH CHECK |
|----------|-----|-------------------------|
| ALL | 1 | `user_id = auth.uid()` (authenticated) |

### `care_checklist_items`

| Operação | Qtd | Detalhe |
|----------|-----|---------|
| SELECT | 1 | `auth.uid() = user_id` |
| INSERT | 1 | WITH CHECK `auth.uid() = user_id` |
| UPDATE | 1 | USING + WITH CHECK `auth.uid() = user_id` |
| DELETE | 1 | USING `auth.uid() = user_id` |

### `vault_system_categories`

| Operação | Qtd | Detalhe |
|----------|-----|---------|
| SELECT | 1 | **`using (true)`** para `authenticated` — leitura global de catálogo sistema (esperado para referência). |

**Gaps:** sem INSERT/UPDATE/DELETE para `authenticated` — só seeds SQL (adequado).

### `vault_categories`, `vault_tags`, `vault_files`, `vault_file_tags`, `vault_file_blobs`

Cada uma: **1 policy FOR ALL** com `using` / `with check` derivados de `user_id = auth.uid()` ou existência de `vault_files` pertencente ao utilizador.

### `vault_quotas`

| Operação | Qtd | Detalhe |
|----------|-----|---------|
| SELECT | 1 | `user_id = auth.uid()` |

**Gaps intencionais / compensados**

- **INSERT/UPDATE/DELETE** para role `authenticated`: **ausentes**. Escrita esperada via **`SECURITY DEFINER`**: `handle_new_user` (insert inicial), `vault_quotas_recalc` (atualização de `used_bytes` / `file_count`).
- Se no futuro existir necessidade de alterar `tier`/`limit_bytes` pelo próprio utilizador, será preciso policy ou RPC explícita.

### Tabela sem RLS que armazena dados de utilizador

Nenhuma no inventário `public` acima — todas com RLS habilitado em `0004`.

---

## 5. Storage policies (bucket `vault`)

Fonte: `0002_vault.sql` (bucket + policies) e `0004_remodel_context_vault.sql` (recria bucket + mesmas policies).

**Bucket**

- `id` / `name`: `vault`
- `public`: `false`
- `file_size_limit`: **52428800** bytes (50 MiB)
- `allowed_mime_types`: **null** (sem lista no DDL — filtro MIME depende da app / `BLOCKED_MIMES` em código)

**Policies em `storage.objects`**

| Policy | Operação | Filtro |
|--------|----------|--------|
| `vault_storage_select_own` | SELECT | `bucket_id = 'vault'` AND primeiro segmento do path = `auth.uid()::text` |
| `vault_storage_insert_own` | INSERT | WITH CHECK idem |
| `vault_storage_update_own` | UPDATE | USING idem |
| `vault_storage_delete_own` | DELETE | USING idem |

Path esperado na app: `{user_id}/{fileId}.{ext}` (`buildStoragePath`), alinhado ao primeiro folder = `auth.uid()`.

---

## 6. Triggers + funções

### Triggers `public`

| Tabela | Evento | Função | Função faz (1 linha) |
|--------|--------|--------|----------------------|
| `profiles` | BEFORE UPDATE | `set_updated_at` | Define `updated_at := now()`. |
| `care_checklist_items` | BEFORE UPDATE | `set_updated_at` | Idem. |
| `vault_files` | BEFORE UPDATE | `set_updated_at` | Idem. |
| `vault_files` | BEFORE INSERT OR UPDATE OF `display_name`, `description`, `text_content` | `vault_files_update_search` | Recalcula `search_vector` (tsvector português + `extensions.unaccent`). |
| `vault_files` | AFTER INSERT OR UPDATE OR DELETE | `vault_files_quota_trigger` | Chama `vault_quotas_recalc(user_id)` quando mudam blob atual, `status` ou `deleted_at`. |
| `vault_file_blobs` | AFTER INSERT OR UPDATE OR DELETE | `vault_file_blobs_sync_version_count` | Atualiza `vault_files.version_count` = count de blobs do `file_id`. |
| `vault_file_blobs` | AFTER INSERT OR DELETE OR UPDATE OF `size_bytes` | `vault_blobs_quota_trigger` | Resolve `user_id` do ficheiro e chama `vault_quotas_recalc`. |
| `vault_quotas` | BEFORE UPDATE | `set_updated_at` | Atualiza `updated_at`. |

### Trigger `auth.users`

| Evento | Função | O que faz |
|--------|--------|-----------|
| AFTER INSERT | `handle_new_user` | INSERT em `profiles` e `vault_quotas` para `new.id` (idempotente `ON CONFLICT DO NOTHING`). |

### Funções `SECURITY DEFINER`

| Função | Risco / papel |
|--------|----------------|
| `vault_quotas_recalc(uuid)` | **SECURITY DEFINER**, `search_path = public, pg_temp`. Atualiza quotas sem depender de RLS do cliente — necessário para quotas corretas. |
| `handle_new_user` | **SECURITY DEFINER**, `search_path = public, pg_temp`. Bootstrap de `profiles` + `vault_quotas`. |

### Idempotência DDL

`0004` usa `drop trigger if exists` / `drop function if exists` antes de recriar nos objetos que redefine — bom para reexecução controlada.  
`0001` usa `drop trigger if exists touch_user_checklist_items` antes do trigger (tabela depois removida por `0004`).

### Funções que referenciam tabelas inexistentes

Nenhuma nas migrations auditadas **após** estado final de `0004`.  
**Código** referencia `vault_classifier_overrides`, que **não** existe no DDL aplicado.

---

## 7. Índices

| Índice | Tabela | Colunas | Tipo / notas |
|--------|--------|---------|----------------|
| `vault_categories_owner` | `vault_categories` | `(user_id, sort_order)` | btree |
| `vault_files_owner_active` | `vault_files` | `(user_id, deleted_at, created_at DESC)` | btree |
| `vault_files_owner_system_category` | `vault_files` | `(user_id, system_category_slug)` WHERE `deleted_at IS NULL AND user_category_id IS NULL` | btree parcial |
| `vault_files_search_gin` | `vault_files` | `search_vector` | **gin** |
| `vault_files_pending_cleanup` | `vault_files` | `(created_at)` WHERE `status = 'pending'` | btree parcial |

**Implícitos:** PKs e `UNIQUE (file_id, version)`, `UNIQUE storage_path` em `vault_file_blobs` criam índices btree.

**Gaps / observações**

- **`vault_files.current_blob_id`:** FK para `vault_file_blobs(id)`; não há índice btree dedicado só a `current_blob_id` além do uso em índices compostos — costuma ser aceitável; joins frequentes por `id` do blob usam PK do blob.
- **FK `vault_file_blobs.file_id`:** coberto por `UNIQUE (file_id, version)` (prefixo `file_id`).
- **`care_checklist_items`:** sem índice secundário além do PK — volume esperado baixo por utilizador.
- **Duplicação:** não há dois índices obviamente redundantes no DDL pós-`0004`.

---

## 8. CHECK constraints + invariantes

### CHECK declarados (`0004`)

| Tabela | Constraint | Expressão (resumo) |
|--------|------------|---------------------|
| `profiles` | — | `care_role` IN (`self`,`caregiver`) ou NULL |
| `vault_files` | nome comprimento | `display_name` length 1..255 |
| `vault_files` | `description` | null ou length ≤ 2000 |
| `vault_files` | `confidence` | null ou ∈ [0,1] |
| `vault_files` | `status` | `pending` \| `ready` \| `failed` |
| `vault_files` | `vault_files_category_scope` | Se `ready`: exatamente um de `system_category_slug` / `user_category_id`; se `pending`/`failed`, ambos podem ser null |
| `vault_file_blobs` | — | `size_bytes > 0`; `length(sha256)=64` |
| `vault_quotas` | — | `tier` ∈ `free`/`premium`/`enterprise` |

### Invariantes na app sem CHECK correspondente

| Invariante | Onde | Gap |
|------------|------|-----|
| Extensões/MIME bloqueados | `vault/validation.ts` + `prepareUpload` | Não há CHECK em `vault_file_blobs` sobre `mime_type`/`extension` — inserção direta SQL poderia violar políticas de segurança da app. |
| Tamanho máximo ficheiro | 50 MiB no bucket + validação Zod | Bucket limita; bypass SQL não passa pelo Storage da mesma forma, mas linha SQL direta em tabela ignoraria Zod. |
| Unicidade “mesmo ficheiro” por utilizador | Lógica em `prepareUpload` (blobs + `current_blob_id`) | **Não** há `UNIQUE (user_id, sha256)` em `vault_files` pós-`0004` (havia no modelo antigo `0002`). Duplicados dependem da query pré-insert. |

---

## 9. Soft-delete consistency

Coluna: `vault_files.deleted_at`.

| Caminho | Filtra `deleted_at IS NULL` (ativos) ou equivalente |
|---------|------------------------------------------------------|
| `listFiles` (`data.ts`) | **Sim** quando `trashed` é false; **só lixo** quando `trashed` true. |
| `getTrashedCount` | **Sim** (`.not('deleted_at','is',null)`). |
| `prepareUpload` duplicate check | `.is('deleted_at', null)` nos `vault_files` ligados aos blobs. |
| `getDownloadUrl` | **Sim** (`if (frow.deleted_at) return fail`). |
| `softDelete` / `restore` | **Sim** (`.is('deleted_at', null)` / `.not('deleted_at','is',null)`). |
| `getFile` (`data.ts`) | **Não** — apenas `user_id` + `id`. **Vazamento potencial de metadados** de ficheiro na lixeira se o `fileId` for conhecido (função exportada em `vault/index.ts`; **sem consumidores** no repo no momento da auditoria). |
| `confirmUpload` | Opera sobre `pending`; cenário trash atípico — não revisto como gap operacional principal. |

---

## 10. Quotas + triggers de recálculo

**Função:** `vault_quotas_recalc(p_user_id)` (`SECURITY DEFINER`)

- **`used_bytes`:** soma `vault_file_blobs.size_bytes` para blobs onde `vault_files.id` tem `current_blob_id = b.id`, `status = 'ready'`, **`deleted_at IS NULL`**.
- **`file_count`:** `COUNT(*)` de `vault_files` com `status = 'ready'` e **`deleted_at IS NULL`**.
- **Soft-deleted:** **não** entram na soma nem na contagem.
- **Versão / troca de blob:** `vault_files_quota_trigger` dispara em mudança de `current_blob_id`, `status` ou `deleted_at`; `vault_blobs_quota_trigger` em INSERT/DELETE/update de `size_bytes` em blobs — cobre novo blob e alterações de tamanho.
- **Blobs antigos** não referenciados por `current_blob_id`: **não** somam em `used_bytes` (só o blob atual por ficheiro). Limpeza órfã depende de política de produto (não auditado em DDL além de CASCADE em deletes de `vault_files`).

**Modelo antigo (`0002`):** quota somava `vault_files.size_bytes` diretamente; **modelo atual (`0004`):** só **`current_blob`** — coerente com ficheiro + revisões em `vault_file_blobs`.

---

## 11. Lista priorizada de findings

| ID | Severidade | Categoria | Resumo | Ação proposta |
|----|------------|-----------|--------|----------------|
| F01 | **CRITICAL** | schema | Código chama `vault_classifier_overrides` (`actions.ts` upsert + select); **tabela não existe** em `0001`–`0004`. | Adicionar migration DDL (+ RLS) alinhada a `types.ts`, ou remover uso até haver schema. |
| F02 | HIGH | integrity | `getFile` não filtra `deleted_at` — metadados de ficheiros na lixeira podem ser lidos por `user_id`+`id`. | Acrescentar `.is('deleted_at', null)` (ou parâmetro explícito trash) antes de expor em API. |
| F03 | MEDIUM | integrity | Encadeamento `.upsert(...).eq('user_id', …)` em `updateMetadata` pode não fazer o pretendido no cliente Supabase. | Validar em runtime / simplificar payload do `upsert`. |
| F04 | MEDIUM | observability | `docs/vault/api.md` ainda menciona artefactos removidos em `0004` (`vault_classification_results`, logs de upload genéricos). | Atualizar docs (fora do pedido deste ficheiro de auditoria técnica se mantido read-only estrito). |
| F05 | LOW | perf | Sem índice dedicado só em `vault_files.current_blob_id` — aceitável na maioria dos casos; monitorizar se joins pesados aparecerem. | Índice parcial opcional se métricas mostrarem bottleneck. |
| F06 | LOW | rls | `vault_system_categories`: policy SELECT `using (true)` para `authenticated` — intencional para catálogo global. | Manter; documentar como decisão de produto. |
| F07 | LOW | integrity | `profiles` criada por trigger mas **não** lida via `.from('profiles')` no código auditado — sem bug, possível funcionalidade futura. | Nenhuma ação obrigatória. |

---

## Referências cruzadas (inputs)

- DDL: `supabase/migrations/0001_user_checklist_items.sql` … `0004_remodel_context_vault.sql`
- Código: `src/features/vault/{actions,data,mappers,classifier,validation,storage,types}.ts`, `src/features/dashboard/{data,actions}.ts`, `src/lib/supabase/types.ts`, `src/lib/server/auth.ts`
- Docs lidos: `docs/schema.md`, `docs/vault/model.md`, `docs/vault/security.md`, `docs/vault/api.md`
