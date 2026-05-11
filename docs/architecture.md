# architecture

arquitetura do senda-senior. contratos de camadas e fluxo de dados.

## stack

```
next.js           16          app router, react server components, server actions
react             19          compiler habilitado
typescript        5           strict
tailwind          4           @theme tokens em globals.css
supabase          @ssr 0.9    auth + postgres + rls
framer-motion     12          animações
lenis             1           smooth scroll
zod               4           validação runtime
```

## camadas

```
                    ┌───────────────────────────┐
  cliente (browser) │ app/, features/*/components│  'use client'
                    └───────────┬───────────────┘
                                │ server actions / fetch cookies
                    ┌───────────▼───────────────┐
  edge              │ proxy.ts                  │  rate-limit, csp, sessão, redirect
                    └───────────┬───────────────┘
                                │
                    ┌───────────▼───────────────┐
  servidor (node)   │ app/*/page.tsx (rsc)      │  requireUser() → getX(userId)
                    │ features/*/actions.ts     │  server-only
                    │ features/*/data.ts        │  server-only
                    │ lib/supabase/server.ts    │  cookie-bound client
                    │ lib/supabase/admin.ts     │  service role (guarded)
                    └───────────┬───────────────┘
                                │ postgres wire
                    ┌───────────▼───────────────┐
  dados             │ supabase postgres + rls   │
                    └───────────────────────────┘
```

## diretórios

```
web/
├── docs/                       esta pasta
├── public/                     assets estáticos
├── supabase/migrations/        sql versionado, numerado sequencialmente
└── src/
    ├── app/                    rotas (app router)
    │   ├── layout.tsx          fontes, smooth scroll, <html>
    │   ├── page.tsx            landing (server component compondo clients)
    │   ├── opengraph-image.tsx og dinâmico via ImageResponse
    │   ├── apple-icon.tsx      apple touch icon dinâmico
    │   ├── auth/callback/      route handler PKCE (Supabase)
    │   ├── dashboard/          área autenticada
    │   ├── financial/          stub force-dynamic, requireUser
    │   ├── health/             stub force-dynamic, requireUser
    │   ├── help/               stub force-dynamic, requireUser
    │   ├── legal/              stub force-dynamic, requireUser
    │   ├── login/              auth público
    │   ├── manual/             leitor digital ([slug] dinâmico)
    │   ├── pricing/            stub force-dynamic, requireUser
    │   ├── profile/            stub force-dynamic, requireUser
    │   ├── settings/           stub force-dynamic, requireUser
    │   ├── update-password/    pós reset
    │   └── vault/              cofre digital (force-dynamic, requireUser)
    │
    ├── proxy.ts                edge middleware (nome canônico em next 16)
    │
    ├── config/
    │   ├── env.ts              zod schema para NEXT_PUBLIC_*
    │   └── env.server.ts       zod schema server-only
    │
    ├── design/                 primitivos de ui (button, field, card, …)
    │
    ├── features/               domínios de negócio
    │   ├── auth/               schemas zod
    │   ├── dashboard/          data, actions, checklistCatalog, components/
    │   ├── landing/            seções da home, shared/
    │   ├── manual/             data (capítulos), components/
    │   └── vault/              cofre digital (actions, data, classifier, components/, client/)
    │
    └── lib/
        ├── server/auth.ts      getUser(), requireUser() — server-only
        ├── supabase/
        │   ├── client.ts       browser client
        │   ├── server.ts       rsc/actions client (cookie-bound)
        │   ├── admin.ts        service-role (throws até configurar)
        │   └── types.ts        Database (curado; substituível por gen types)
        └── utils/              smooth scroll wrapper, etc.
```

## contratos de autenticação

rota protegida passa por três linhas de defesa independentes:

1. **edge** (`proxy.ts`): sem sessão em `/dashboard` ou `/update-password` → 302 para `/login?next=<pathname>`. sessão em `/login` → 302 para `/dashboard`.
2. **servidor** (`lib/server/auth.ts::requireUser`): em rsc e server actions. retorna `User` ou chama `redirect('/login')`. lê `x-pathname` injetado pelo proxy para preservar destino.
3. **banco** (rls): policies em `user_*` tabelas checam `auth.uid() = user_id`.

nenhuma camada confia na anterior. proxy pode ser ignorado em dev se o matcher excluir; rsc sempre confirma.

## fluxo de mutação

```
componente cliente
    │ chama server action importada
    ▼
'use server'
    │ zod.safeParse(input)          ← rejeita cedo, mensagem limpa
    │ requireUser()                  ← autentica
    │ createClient() [server]        ← cookie-bound, rls ativa
    │ supabase.from(x).upsert(…)
    │ revalidatePath('/...')
    ▼
{ ok: true } | { ok: false, error }  ← nunca lança para o cliente
```

cliente aplica `useOptimistic` e reconcilia via `revalidatePath`.

## env

duas superfícies:

| arquivo              | quando carrega          | chaves permitidas                |
|----------------------|-------------------------|----------------------------------|
| `config/env.ts`      | client + server         | `NEXT_PUBLIC_*`                  |
| `config/env.server.ts` | server (`server-only`)| `SUPABASE_SERVICE_ROLE_KEY`, etc |

ambos validam com zod no boot. ausência → throw com mensagem formatada. nunca acessar `process.env` fora desses arquivos.

## supabase clients

três instâncias, nunca misturadas:

| módulo                     | contexto   | cookies | rls | uso                        |
|----------------------------|------------|---------|-----|----------------------------|
| `lib/supabase/client.ts`   | browser    | browser | on  | interação rápida do usuário logado |
| `lib/supabase/server.ts`   | rsc/action | node    | on  | leitura/escrita autenticada server-side |
| `lib/supabase/admin.ts`    | server-only| —       | off | operações administrativas (pendente chave) |

regra: componente `'use client'` nunca importa de `server.ts`/`admin.ts`. o diretório `server-only` quebra o build se tentar.

## persistência do checklist

```
features/dashboard/checklistCatalog.ts  fonte única dos itens (key + texto)
features/dashboard/types.ts             ChecklistItem = { key, text, done }
features/dashboard/data.ts              getChecklist(userId): merge catálogo + db
features/dashboard/actions.ts           toggleChecklistItem({key, done})
supabase/migrations/0004_*.sql          profiles, care_checklist_items, vault remodelado
```

banco guarda apenas estado (`done`), nunca texto. adicionar item novo = editar catálogo; remover = idem. estado legado de item removido fica órfão no banco mas é ignorado pelo merge.

## design tokens

todos em `@theme` de `globals.css`:

```
--color-*        paleta (green, cream, terracotta, ink, …)
--font-serif     eb garamond (via next/font)
--font-sans      dm sans
--radius-*       xs, sm, md, lg
--ease-senda     cubic-bezier canônico
```

aliases legados (`--green`, `--text`, …) existem em `:root` e apontam para os `--color-*`. novos componentes usam `--color-*` direto.

## deploy

vercel, região padrão. branch `main` = produção. env vars configuradas no dashboard.

demo atual: <https://senda-senior.vercel.app>.
