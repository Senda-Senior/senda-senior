# Senda Sênior — notas do mapa (`system-architecture-full.mmd`)

O ficheiro `.mmd` contém **apenas** sintaxe Mermaid (primeira linha = `flowchart TB`).  
Parsers estritos falham com blocos `%%` ou Markdown antes do tipo de diagrama; o inventário textual fica aqui.

## Stack

Next.js 16.x, React 19, Tailwind v4 (`@theme` em `globals.css`), Supabase SSR, Vitest, Playwright.

## Convenção Next

`src/proxy.ts` = interceptador de pedidos (middleware-like), com `proxy` + `config.matcher`. Não há `src/middleware.ts`.

## Rotas `src/app`

| Caminho | dynamic | Imports principais |
|---------|---------|---------------------|
| `/` | default | `landing` barrel + `SmoothScroll` |
| `/login` | — | `auth` |
| `/auth/callback` | — | Route GET: `@supabase/ssr`, `@/config/env` |
| `/update-password` | — | `auth`, `design` |
| `/dashboard` | force-dynamic | `dashboard`, `requireUser` |
| `/vault` | force-dynamic | `vault`, `requireUser` |
| `/manual` | — | `manual` → redirect primeiro slug |
| `/manual/[slug]` | — | `manual`, `DigitalReader` |
| `/profile`, `/settings`, `/health`, `/legal`, `/pricing`, `/financial` | force-dynamic | `design` (Button), `requireUser` — stubs |
| `/help` | force-dynamic | `requireUser` apenas — stub |

**Layouts:** raiz `layout.tsx` (fonts + `globals.css`); `manual/layout.tsx` (`ReaderBodyLock` + wrapper cream).

**Outros:** `globals.css`, `not-found.tsx`, `opengraph-image.tsx`, `apple-icon.tsx`, `favicon.ico`.

## Proteção

1. **`src/proxy.ts`:** `PROTECTED_PREFIXES` em `lib/server/proxy/routes.ts`: `/dashboard`, `/update-password`, `/vault`.
2. **`requireUser()`:** páginas server; `/profile` etc. não estão no proxy mas usam `requireUser`.

## Proxy (resumo)

- CSP nonce; `STRICT_CSP_PREFIXES`: `/dashboard`, `/vault`.
- Rate limit: buckets global / auth / upload (`lib/server/rate-limit.ts`).
- `pickBucket`: prefixo `/api/vault/upload` → upload (**rota API ainda não existe** neste repo); login / update-password / auth → auth.

Upload vault real: Server Actions + URLs assinadas — sem `src/app/api/**`.

## Config

- `config/env.ts` — `NEXT_PUBLIC_*` (Zod).
- `config/env.server.ts` — service role, Upstash, flags E2E (opcional).

## Supabase

`lib/supabase`: `client.ts`, `server.ts`, `admin.ts`, `types.ts`.

**Migrations:** `0001_user_checklist_items`, `0002_vault`, `0003_vault_unaccent_fix`, `0004_remodel_context_vault`.

## Design

`design/index.ts`: `cn`, `Button`, `Card`, `Divider`, `Field`, `Label`, `Reveal`, `Section`, `ConfirmDialog`.  
Regra: `design/*` não importa `features/` nem `app/`.

## Landing

Barrel exporta os componentes montados em `app/page.tsx`. Um conjunto antigo de componentes órfãos (`BrandBeats`, `ParaQuem`, `Pilares`, `Problema`, `QuemSomos`, `Servicos`) foi **eliminado no cleanup Phase 4** (commit `5561007`); não há mais `.tsx` desses nomes no repo.

**Diagrama:** rotas stub (`RT5`) ligam a **`IDX`** (`lib/server/index.ts`), não só a `auth.ts`, porque o entry real das páginas server é `requireUser` / contrato `lib/server` — além de `@/design` onde aplicável.


## Cross-feature

`vault/components/VaultView.tsx` importa `dashboard/components/LogoutButton` (caminho direto).

## Tooling

- Testes: `src/test/*`, `**/*.test.ts(x)`
- E2E: `tests/*.spec.ts` (Playwright)
- Scripts: `scripts/compress-public-images.mjs`
