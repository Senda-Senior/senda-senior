# conventions

regras de escrita, nomeação e organização.

## nomeação de arquivos

| tipo                        | caso            | exemplo                            |
|-----------------------------|-----------------|------------------------------------|
| rota (app router)           | kebab / lower   | `update-password/page.tsx`         |
| componente react            | pascal          | `DashboardView.tsx`                |
| hook                        | camel com `use` | `useParallax.ts`                   |
| módulo de dados/util        | camel           | `checklistCatalog.ts`              |
| server action                | camel plural    | `actions.ts`                       |
| tipos compartilhados        | camel           | `types.ts`                         |
| doc/markdown                | lower           | `architecture.md`                  |
| migration sql               | `NNNN_snake.sql`| `0004_remodel_context_vault.sql`   |

nunca usar espaço, acento ou maiúsculo em nomes de pasta.

## fronteira client / server

1. arquivo começa com `'use client'` → não pode importar de `lib/server/*`, `lib/supabase/server.ts`, `lib/supabase/admin.ts`, `features/*/data.ts`, `features/*/actions.ts` diretamente (exceto server actions via assinatura async).
2. arquivo com `import 'server-only'` no topo → não é bundle-able para o cliente. use em tudo que acessa secrets ou banco com privilégio.
3. server action (`'use server'`) pode ser importada pelo cliente e chamada como função — o runtime cuida do rpc.
4. nunca chame `process.env.*` fora de `config/env.ts` ou `config/env.server.ts`.

## autenticação em rota protegida

```ts
export default async function Page() {
  const user = await requireUser()            // primeira linha
  const data = await getX(user.id)            // data.ts faz a query com cookie do user
  return <View userEmail={user.email} data={data} />
}
```

nunca:

```ts
'use client'
useEffect(() => { supabase.auth.getUser().then(...) }, [])   // errado
if (!user) router.push('/login')                             // errado: flicker + inseguro
```

## mutação de estado

toda escrita passa por server action:

```ts
'use server'
export async function doX(input: unknown) {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: ... }
  const user = await requireUser()
  const supabase = await createClient()
  const { error } = await supabase.from('t').upsert(...)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/rota-afetada')
  return { ok: true }
}
```

retorno discriminado (`{ ok: true } | { ok: false, error: string }`). nunca `throw` para o cliente.

## estilo de código

- aspas simples em ts/tsx.
- sem ponto-e-vírgula final (segue config next).
- imports agrupados: built-in → externos → `@/*` → relativos.
- componente react = função nomeada, nunca `default export` anônimo exceto em `page.tsx`/`layout.tsx` por exigência do next.
- `const` por padrão. `let` só quando reatribui de fato.
- sem `any`. use `unknown` + narrowing ou zod.
- comentário explica intenção, nunca narra o código.

## design tokens

- cor: sempre `var(--color-*)`. nunca literal hex dentro de componente.
- fonte: `var(--font-serif)` / `var(--font-sans)`.
- raio: `var(--radius-*)`.
- easing: `var(--ease-senda)`.

estilos inline são aceitos (legado da demo) mas devem referenciar as tokens acima.

## commits

```
tipo: resumo curto em minúsculas

corpo opcional, 72 colunas, explicando o porquê.
```

tipos: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `build`, `ci`.

exemplo:

```
feat: persistir checklist do dashboard via server action

upsert em care_checklist_items com rls por user_id.
estado otimista no cliente via useOptimistic.
```

## branches

- `main` → produção. deploy automático na vercel.
- `feat/<escopo>`, `fix/<escopo>` → feature branches. pr → main.
- nunca commit direto em `main` depois da estabilização.

## migrations

- numeradas `NNNN_snake_case.sql`.
- ordem é linear. nunca editar migration já aplicada; criar nova.
- toda tabela `public.*` com dados do usuário tem rls habilitada e policies explícitas (select/insert/update/delete).
- `updated_at` com trigger padrão quando a tabela aceita updates.

## zod

- schemas em arquivo `schemas.ts` por feature.
- mensagem de erro em português.
- `safeParse` em server action; `parse` só no boot (env).

## portuguêS

ui, comentários, commits, docs → português. nomes técnicos (react, rsc, rls, env) permanecem em inglês.

## proibições

- `dangerouslySetInnerHTML` sem sanitização explícita.
- `fetch` direto em componente cliente para recurso autenticado — passe por server action ou rsc.
- `localStorage` para dados sensíveis. cookie httpOnly via supabase já resolve.
- `window.*` em componente não marcado `'use client'`.
- service role key em qualquer coisa acessível pelo cliente.

