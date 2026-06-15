/**
 * auth.ts
 * Contrato de autenticação servidor — getUser() e requireUser() para proteção de rotas
 *
 * Conecta: importa createServerClient, headers, redirect | importado em server actions/route handlers
 * Camada: server (server-only)
 */

import 'server-only'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * ─── Contrato de autenticação no servidor ──────────────────────────
 *
 * Toda rota/Server Action protegida DEVE passar por `requireUser()`.
 * Nunca confie em estado do cliente para decidir autorização.
 *
 *   const user = await requireUser()
 *
 * Comportamento:
 *   - Se há sessão válida: retorna o `User` tipado.
 *   - Se não há: redireciona para /login?next=<pathname>.
 *
 * Para cenários em que você QUER saber se o usuário está logado mas
 * não quer redirecionar (ex.: rotas públicas com UI condicional),
 * use `getUser()`.
 * ───────────────────────────────────────────────────────────────────
 */

export async function getUser(): Promise<User | null> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireUser(): Promise<User> {
  const user = await getUser()

  if (!user) {
    const pathname = await currentPathname()
    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
    redirect(`/login${next}`)
  }

  return user
}

/**
 * Tenta recuperar o pathname atual a partir dos cabeçalhos que o
 * `proxy.ts` injeta (`x-pathname`). Retorna null se não estiver
 * disponível — nesse caso, o redirect volta para /login sem `next`.
 */
async function currentPathname(): Promise<string | null> {
  try {
    const h = await headers()
    return h.get('x-pathname')
  } catch {
    return null
  }
}

