/**
 * env.ts
 * Validação de variáveis de ambiente públicas (NEXT_PUBLIC_*) com Zod — roda em dev/build e falha se ausentes
 *
 * Conecta: lê process.env | importado em toda app (browser + server)
 * Camada: shared (validação na inicialização)
 */

import { z } from 'zod'

/**
 * ─── Contrato de variáveis de ambiente ─────────────────────────────
 *
 * Regras:
 *  - Toda variável consumida pelo app passa por este arquivo.
 *  - NUNCA leia `process.env.FOO` diretamente em código de aplicação.
 *  - Variáveis `NEXT_PUBLIC_*` são inlinadas pelo Next em build-time,
 *    portanto precisam ser referenciadas explicitamente (não dá para
 *    usar um spread dinâmico sobre `process.env`).
 *  - Variáveis server-only entram em `env.server.ts`, que importa
 *    `server-only` e falha o build se vazar para o cliente.
 *
 * A validação roda no primeiro import — em dev e em build. Se faltar
 * alguma variável, o processo encerra com mensagem clara.
 * ───────────────────────────────────────────────────────────────────
 */

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória.'),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL deve ser uma URL válida.')
    .optional(),
  // Cloudflare Turnstile (CAPTCHA anti-bot no auth). Opcional no schema, mas
  // obrigatório na prática se Attack Protection estiver ligado no Supabase —
  // sem a key o login falha com captcha_failed. Use a mesma key em prod e local;
  // em Cloudflare, permita o hostname localhost no widget.
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
})

const clientProcessEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
}

const parsed = clientSchema.safeParse(clientProcessEnv)

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(
    `[env] Variáveis de ambiente inválidas ou ausentes:\n${details}\n\n` +
      `Verifique o arquivo .env.local e compare com .env.example.`,
  )
}

export const env = parsed.data
export type Env = typeof env
