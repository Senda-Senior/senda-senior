/**
 * AuthBrandPanel.tsx
 * Painel visual esquerdo das páginas de auth com foto de marca e gradientes de leitura.
 *
 * Conecta: importa NextImage (next/image) | importado por AuthPage (pages)
 * Camada: browser
 */

'use client'

import type { ReactNode } from 'react'
import NextImage from 'next/image'

type AuthBrandPanelProps = {
  children: ReactNode
  /** Fotografia editorial — ex.: prancheta-7 ou card-elder-window */
  photoSrc: string
  /** Foco da imagem (cover) */
  objectPosition?: string
}

/** Painel esquerdo das páginas de auth: foto editorial e gradientes de leitura. */
export function AuthBrandPanel({ children, photoSrc, objectPosition = '22% 45%' }: AuthBrandPanelProps) {
  return (
    <div
      className="auth-panel-left"
      style={{
        flex: '0 0 45%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 5vw, 80px)',
      }}
    >
      <NextImage
        src={photoSrc}
        alt=""
        aria-hidden
        fill
        priority
        sizes="45vw"
        style={{
          objectFit: 'cover',
          objectPosition,
          zIndex: 0,
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(100deg, rgba(16, 22, 18, 0.82) 0%, rgba(16, 22, 18, 0.48) 45%, rgba(16, 22, 18, 0.12) 75%)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'linear-gradient(160deg, transparent 22%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="auth-panel-content"
        style={{ position: 'relative', zIndex: 10, maxWidth: 420 }}
      >
        {children}
      </div>
    </div>
  )
}
