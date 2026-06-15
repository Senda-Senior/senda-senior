/**
 * manual/page.tsx
 * Index do manual — redireciona para o primeiro capítulo (slug-based)
 *
 * Conecta: manualChapters (features/manual)
 * Camada: server (RSC)
 */

import { redirect } from 'next/navigation'
import { manualChapters } from '@/features/manual'

export default function ManualIndex() {
  redirect(`/manual/${manualChapters[0].slug}`)
}
