'use client'

import { useEffect } from 'react'

/**
 * Aplica `body.reader-locked` enquanto o leitor está montado e remove
 * ao desmontar — evita overflow:hidden “vazar” em client navigations.
 */
export function ReaderBodyLock() {
  useEffect(() => {
    document.body.classList.add('reader-locked')
    return () => {
      document.body.classList.remove('reader-locked')
    }
  }, [])

  return null
}
