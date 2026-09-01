# senda-senior

plataforma de planejamento e assessoria sênior. next.js 16 + supabase.

## requisitos

- node 20+
- npm 10+
- projeto supabase com rls ativa

## setup

```
cp .env.example .env.local       # preencher NEXT_PUBLIC_SUPABASE_*
npm install
npm run dev                      # http://localhost:3000
```

aplicar migrations uma vez:

```
# via supabase cli
supabase db push

# ou cole supabase/migrations/*.sql no sql editor
```

## scripts

| comando              | ação                                   |
|----------------------|----------------------------------------|
| `npm run dev`        | servidor de desenvolvimento            |
| `npm run build`      | build de produção                      |
| `npm run start`      | serve build                            |
| `npm run lint`       | eslint                                 |
| `npm run typecheck`  | tsc --noEmit                           |

## estrutura

```
src/app/          rotas
src/proxy.ts      edge middleware (next 16)
src/config/       env validation (zod)
src/design/       primitivos de ui
src/features/     domínios: auth, dashboard, landing, manual
src/lib/          supabase clients, auth helpers, utils
supabase/migrations/  sql versionado
docs/             arquitetura, convenções, segurança
```

## documentação

- [architecture](docs/architecture.md) — camadas, fluxo de dados, contratos
- [schema](docs/schema.md) — tabelas, relações, storage, triggers (pós-0004)
- [conventions](docs/conventions.md) — nomeação, estilo, commits, proibições
- [security](docs/security.md) — controles, lgpd, pendências
- [env](docs/env.md) — variáveis de ambiente
- [vault/](docs/vault/readme.md) — cofre de documentos (requisitos, modelo, classificação)

## deploy

vercel, branch `main` = produção. env vars configuradas no dashboard.
