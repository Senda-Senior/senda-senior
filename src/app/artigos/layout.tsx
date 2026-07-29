/**
 * artigos/layout.tsx
 * Layout do leitor de conteúdos — trava scroll do body no modo leitura.
 *
 * Conecta: ReaderBodyLock (features/content)
 * Camada: server
 */

import type { ReactNode } from 'react'
import { ReaderBodyLock } from '@/features/content'

export default function ArtigosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ReaderBodyLock />
      {children}
    </>
  )
}
