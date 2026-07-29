/**
 * manual/layout.tsx
 * Layout mínimo da rota legada /manual (só redirect — sem leitor).
 *
 * Camada: server
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Conteúdos | Senda Sênior',
  description: 'Artigos e conteúdos da Senda Sênior sobre planejamento do cuidado.',
  robots: { index: false, follow: false },
}

export default function ManualLayout({ children }: { children: ReactNode }) {
  return children
}
