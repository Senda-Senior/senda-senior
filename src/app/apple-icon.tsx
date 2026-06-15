/**
 * apple-icon.tsx
 * Apple touch icon dinâmica — gerada via next/og para home screen iOS
 *
 * Conecta: nenhuma (asset estático)
 * Camada: server (route handler de imagem)
 */

import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#4a5e4a',
          color: '#f5f0e8',
          fontFamily: 'serif',
          fontSize: 108,
          fontWeight: 500,
          letterSpacing: '-0.04em',
          borderRadius: 36,
        }}
      >
        S
      </div>
    ),
    { ...size },
  )
}
