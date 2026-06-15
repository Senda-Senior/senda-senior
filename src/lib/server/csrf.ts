/**
 * csrf.ts
 * Proteção CSRF com validação de origin — assertSameOrigin() para usar primeira linha de server actions
 *
 * Conecta: importa headers, env.server | importado em server actions mutáveis
 * Camada: server (server-only)
 */

import 'server-only'
import { headers } from 'next/headers'
import { serverEnv } from '@/config/env.server'

function parseOrigin(value: string): string | null {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function isLocalHost(host: string): boolean {
  return (
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]')
  )
}

function originFromHost(host: string): string {
  const proto = isLocalHost(host) ? 'http' : 'https'
  return `${proto}://${host}`
}

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
  const siteOrigin = serverEnv.NEXT_PUBLIC_SITE_URL
    ? parseOrigin(serverEnv.NEXT_PUBLIC_SITE_URL)
    : null

  // Constrói a(s) origem(ns) esperada(s)
  const allowedOrigins = new Set<string>()

  if (siteOrigin) {
    allowedOrigins.add(siteOrigin)
  }

  const canFallbackToHost =
    !siteOrigin || process.env.NODE_ENV !== 'production'

  if (host && canFallbackToHost) {
    const hostOrigin = originFromHost(host)

    if (!siteOrigin || hostOrigin === siteOrigin || isLocalHost(host)) {
      allowedOrigins.add(hostOrigin)
    }
  }

  if (allowedOrigins.size === 0) {
    console.warn('[csrf] allowedOrigins vazio — verifique NEXT_PUBLIC_SITE_URL e o header host')
    throw new Error('Requisição bloqueada: configuração de origem ausente.')
  }

  if (!allowedOrigins.has(origin)) {
    throw new Error('Requisição bloqueada: origem inválida.')
  }
}
