/**
 * api/csp-report/route.ts
 * Endpoint para Content Security Policy violations — loga avisos de CSP no console
 *
 * Conecta: nenhuma (endpoint de logging)
 * Camada: server (route handler POST)
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.warn('[csp-violation]', JSON.stringify(body))
  } catch {
    // ignore malformed
  }
  return new NextResponse(null, { status: 204 })
}
