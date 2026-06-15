/**
 * index.ts
 * Barrel export dos clientes Supabase — re-exporta createBrowserClient e tipos
 *
 * Conecta: re-exporta client.ts, types.ts | importado em components
 * Camada: shared
 */

export { createClient as createBrowserClient } from './client'
export type { Database } from './types'
