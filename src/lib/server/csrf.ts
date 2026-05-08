import 'server-only'
import { headers } from 'next/headers'
import { serverEnv } from '@/config/env.server'

/**
 * Lança um erro se a requisição vier de uma origem diferente do app.
 *
 * Next.js 16 já valida a origem internamente para Server Actions, mas
 * esta camada explícita torna a proteção CSRF auditável e garante
 * consistência mesmo se o comportamento padrão mudar entre versões.
 *
 * Uso — primeira linha de cada Server Action mutável:
 *   await assertSameOrigin()
 */
export async function assertSameOrigin(): Promise<void> {
  const h = await headers()
  const origin = h.get('origin')

  // Requisições sem Origin (ex.: chamadas diretas server-side) são seguras
  if (!origin) return

  const host = h.get('host')
  const siteUrl = serverEnv.NEXT_PUBLIC_SITE_URL

  // Constrói a(s) origem(ns) esperada(s)
  const allowedOrigins = new Set<string>()

  if (siteUrl) {
    try {
      allowedOrigins.add(new URL(siteUrl).origin)
    } catch {
      // siteUrl malformada — ignora, cai no host
    }
  }

  if (host) {
    const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')
    const proto = isLocal ? 'http' : 'https'
    allowedOrigins.add(`${proto}://${host}`)
  }

  if (allowedOrigins.size === 0) {
    console.warn('[csrf] allowedOrigins vazio — verifique NEXT_PUBLIC_SITE_URL e o header host')
    throw new Error('Requisição bloqueada: configuração de origem ausente.')
  }

  if (!allowedOrigins.has(origin)) {
    throw new Error('Requisição bloqueada: origem inválida.')
  }
}
