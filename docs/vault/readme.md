# vault

cofre digital de documentos do usuário. subsistema independente, integrado ao dashboard.

## leia nesta ordem

1. [schema](../schema.md) — referência compacta de todas as tabelas e relações
2. [requirements](requirements.md) — requisitos funcionais, não-funcionais e regras de negócio
3. [model](model.md) — modelo lógico (tabelas, rls, storage)
4. [classification](classification.md) — algoritmo de auto-categorização
5. [api](api.md) — server actions, rsc helpers, tipos públicos
6. [security](security.md) — ameaças, criptografia, auditoria

## status

| etapa                                      | status     |
|--------------------------------------------|------------|
| análise de requisitos                      | ok         |
| modelo lógico                              | ok         |
| algoritmo de classificação (spec)          | ok         |
| api contract                               | ok         |
| decisões arquiteturais pendentes           | ver questions |
| migration sql                              | aplicado (0002, 0003, 0004) |
| implementação de código                    | em produção                  |

## decisões arquiteturais chave

- storage: **supabase storage** (bucket `vault` privado, signed urls)
- db: **supabase postgres** com rls por `auth.uid()`
- criptografia repouso mvp: **aes-256 nativo do supabase**
- pastas privadas com e2e: **pós-mvp** (fr-18)
- classificador: **heurística multi-signal**, puro, server-side
- busca full-text: **pós-mvp** (usa tsvector + ocr)

## dependências novas

- upload: nenhuma nova (supabase-js basta)
- hash client: `crypto.subtle.digest('SHA-256', ...)` nativo do browser
- magic bytes server: `file-type` (~50kb)
- ocr (pós-mvp): `tesseract.js` ou google cloud vision
