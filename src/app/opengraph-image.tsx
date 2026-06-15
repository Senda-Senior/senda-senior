/**
 * opengraph-image.tsx
 * OG image dinâmica — gerada em runtime (nodejs) via next/og para social shares
 *
 * Conecta: nenhuma (asset estático)
 * Camada: server (route handler de imagem)
 */

import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Senda Sênior — Planejamento & Assessoria Sênior'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '96px',
          background: '#f5f0e8',
          color: '#2a2520',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#b5724a',
            marginBottom: 40,
            fontWeight: 600,
          }}
        >
          Planejamento & Assessoria Sênior
        </div>
        <div
          style={{
            fontSize: 84,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            fontWeight: 500,
            maxWidth: 960,
          }}
        >
          Senda Sênior
        </div>
        <div
          style={{
            fontSize: 44,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            fontStyle: 'italic',
            color: '#4a5e4a',
            marginTop: 16,
            maxWidth: 960,
          }}
        >
          Uma jornada de cuidado e independência.
        </div>
        <div
          style={{
            marginTop: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 4,
              background: '#b5724a',
              borderRadius: 2,
            }}
          />
          <span style={{ fontSize: 22, color: '#4a4540' }}>
            sendasenior.com.br
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
