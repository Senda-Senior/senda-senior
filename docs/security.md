# security

modelo de ameaça e controles.

## superfície

```
cliente (browser)  ─┐
                    ├─► proxy.ts (edge)  ─► rsc / actions ─► postgres (rls)
assets estáticos ──┘
```

## controles por camada

### edge (`proxy.ts`)

| controle                  | valor                                    |
|---------------------------|------------------------------------------|
| rate limit                | upstash redis (3 buckets); fallback in-memory |
| csp (prod)                | `strict-dynamic` + nonce por request     |
| csp (dev)                 | `unsafe-inline`/`unsafe-eval` (hmr)      |
| csp fonts/styles          | `self`, google fonts, adobe typekit      |
| csp connect               | `self`, supabase, vercel live, typekit   |
| x-frame-options           | `DENY`                                   |
| x-content-type-options    | `nosniff`                                |
| referrer-policy           | `strict-origin-when-cross-origin`        |
| permissions-policy        | camera, microphone, geolocation, topics → off |
| strict-transport-security | `max-age=63072000; includeSubDomains; preload` |
| cookie da sessão          | `httpOnly; secure; sameSite=lax; path=/` |
| redirect não autenticado  | `/dashboard`, `/update-password`, `/vault` → `/login?next=...` |

### rate limit — buckets

| bucket   | rota                       | limite        |
|----------|----------------------------|---------------|
| `global` | geral                      | 100 / 60s / ip |
| `auth`   | `/login`, `/update-password` | 10 / 60s / ip  |
| `upload` | server action `prepareUpload` (vault) | 30 / 60s / ip  |

Modo distribuído ativo quando `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` presentes. Response inclui `X-RateLimit-Mode` para debug.

### servidor

- `requireUser()` confirma sessão em toda rota protegida, independente do proxy.
- `server-only` impede que módulos sensíveis sejam empacotados para o cliente.
- server actions validam input com zod antes de qualquer io.
- erros de banco são mascarados em `{ ok: false, error }` sem stack trace.

### banco

- rls habilitada em toda tabela `user_*`.
- policies por operação (select/insert/update/delete) com `auth.uid() = user_id`.
- service role key nunca sai do server, guardado em `lib/supabase/admin.ts` com `server-only`.

## gestão de segredos

- env vars em `.env.local` (dev) e vercel dashboard (prod).
- `.env.example` lista apenas chaves, nunca valores.
- `.gitignore` cobre `.env*` exceto `.env.example`.
- rotação de service role key não quebra nada: grep por `SUPABASE_SERVICE_ROLE_KEY` deve achar uso exclusivo em `admin.ts`.

## lgpd

- dados pessoais em supabase, região controlada.
- direito à exclusão: `delete from auth.users where id = ?` cascateia nas tabelas `user_*` via fk.
- direito à exportação: pendente endpoint `/api/export`.
- sem analytics de terceiros por padrão.

## pendências conhecidas

- falta endpoint de health check e audit log estruturado.
- audit log estruturado pendente (rls + logs vercel são a base atual; ver vault/security.md "auditoria").
