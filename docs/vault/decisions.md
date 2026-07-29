# vault/decisions

decisões arquiteturais tomadas como default. revisar e ajustar conforme o produto evolui.

## crypto em repouso

**escolhido**: híbrido — aes-256 do supabase em tudo + coluna `is_private` reservada para futuras pastas com client-side encryption (e2e zero-knowledge).

razão: classificação automática exige conteúdo legível; e2e quebra esse fluxo. híbrido entrega 99% do produto agora e mantém a porta aberta.

implementação atual: somente server-side. coluna `is_private` existe mas só aceita `false` enquanto o pipeline e2e não estiver pronto.

## quotas

**escolhido**: tiered. tabela `vault_quotas` tem coluna `tier` (`free`, `premium`, `enterprise`). default `free` com 500 mb e 50 mb/arquivo.

migrar para outro tier = `update vault_quotas set tier='premium', limit_bytes=10737418240`.

## sharing

**escolhido (0016)**: compartilhamento **por solicitação de assessoria**, não share genérico do cofre.

- `advisory_advisors` (allowlist) + `advisory_links` (vínculo) + `document_requests` (`vault_file_id`).
- Assessora **não** lista o cofre do cliente; ganha SELECT só no arquivo citado na solicitação (status entregue) de vínculo `active`.
- Storage: SELECT estreito no path do blob entregue (signed URL com JWT); sem INSERT/UPDATE/DELETE.
- `vault_shares` genérico **não** voltou (foi removido em 0004).

MVP sem UI completa ainda — schema + RLS + action de download por request.

## ocr / busca full-text

**escolhido**: schema preparado, extração desligada.

`vault_files` tem `text_content text` e `search_vector tsvector` com índice gin. trigger atualiza `search_vector` a partir de `display_name + description + text_content`.

mvp não popula `text_content`. quando ocr entrar (edge function ou job), basta inserir o texto.

## tamanhos máximos

| limite                          | valor           |
|---------------------------------|-----------------|
| arquivo individual              | 50 mb           |
| quota free                      | 500 mb          |
| quota premium                   | 10 gb           |
| quota enterprise                | 100 gb          |
| nome exibido                    | 255 chars       |
| descrição                       | 2000 chars      |
| tags por arquivo                | 20              |
| versões guardadas por arquivo   | 10              |
| ttl signed url download         | 5 min           |
| ttl signed url upload           | 30 min          |
| retenção lixeira                | 30 dias         |
| retenção access log             | 90 dias         |

## stack adicional

- `@upstash/ratelimit` + `@upstash/redis` (já adicionado para o proxy)
- supabase storage (nativo, sem dep nova)

## o que **não** está incluído no mvp

- compartilhamento (ui/actions)
- pastas privadas com e2e
- ocr / busca full-text de conteúdo
- antivírus
- upload resumível (tus)
- exportação em zip
- regras customizadas de classificação
- thumbnails server-side (preview usa o arquivo direto via signed url)

todos com schema preparado quando aplicável; só falta a implementação.
