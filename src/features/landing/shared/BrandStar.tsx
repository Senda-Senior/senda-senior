'use client'

import NextImage from 'next/image'

/**
 * BrandStar.tsx
 * Estrela de 4 pontas — elemento SVG principal + cluster de 4 + raster images (PNG sem fundo)
 *
 * Conecta: nenhum | usa NextImage para assets raster
 * Camada: browser
 */
'use client'

interface BrandStarProps {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

export function BrandStar({ size = 24, color = 'currentColor', className, style }: BrandStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 0C12 0 14.5 9.5 12 12C9.5 14.5 0 12 0 12C0 12 9.5 14.5 12 12C14.5 9.5 12 24 12 24C12 24 9.5 14.5 12 12C14.5 9.5 24 12 24 12C24 12 14.5 9.5 12 12C9.5 14.5 12 0 12 0Z" />
    </svg>
  )
}

/*
 * Cluster de 4 estrelas na paleta de accent da marca.
 * Cores da Prancheta 4: terracotta escuro, cobre, dourado, cream
 */
interface StarClusterProps {
  size?: number
  mono?: string
  className?: string
  style?: React.CSSProperties
}

export function StarCluster({ size = 48, mono, className, style }: StarClusterProps) {
  const colors = mono
    ? [mono, mono, mono, mono]
    : [
        'var(--color-terracotta)',
        'var(--color-terracotta-light)',
        'var(--color-gold)',
        'var(--color-cream-dark)',
      ]

  const half = size / 2
  const starSize = size * 0.44

  return (
    <div
      className={className}
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `${half}px ${half}px`,
        gap: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      {colors.map((c, i) => (
        <BrandStar key={i} size={starSize} color={c} />
      ))}
    </div>
  )
}

/* ── Raster cluster (arquivo da pasta brand / design) — preferir em destaque visual ── */

type BrandClusterImageProps = {
  widthPx?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

const CLUSTER_NATURAL_W = 430
const CLUSTER_NATURAL_H = 580

/** Cluster de 4 estrelas — PNG sem fundo (Prancheta 4). */
export function BrandClusterImage({
  widthPx = 320,
  className,
  style,
  priority,
}: BrandClusterImageProps) {
  return (
    <NextImage
      src="/brand/Prancheta_4-removebg-preview.png"
      alt=""
      width={CLUSTER_NATURAL_W}
      height={CLUSTER_NATURAL_H}
      priority={priority}
      className={className}
      sizes={`(max-width: 768px) 90vw, ${Math.min(widthPx, 520)}px`}
      style={{
        width: widthPx,
        maxWidth: '100%',
        height: 'auto',
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}

const SEAL_NATURAL_W = 430
const SEAL_NATURAL_H = 580

type BrandSealCardProps = {
  widthPx?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

/** Selo / cartão marca — PNG sem fundo (CARD-removebg). */
export function BrandSealCardImage({
  widthPx = 56,
  className,
  style,
  priority,
}: BrandSealCardProps) {
  return (
    <NextImage
      src="/brand/CARD-removebg-preview.png"
      alt="Senda Sênior"
      width={SEAL_NATURAL_W}
      height={SEAL_NATURAL_H}
      priority={priority}
      className={className}
      sizes={`${Math.min(widthPx, 160)}px`}
      style={{
        width: widthPx,
        maxWidth: '100%',
        height: 'auto',
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}

const MANIFESTO_CARD_W = 430
const MANIFESTO_CARD_H = 580

type Prancheta8CardProps = {
  widthPx?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

/** Arte editorial manifesto — PNG sem fundo (Prancheta 8). */
export function Prancheta8CardImage({
  widthPx = 360,
  className,
  style,
  priority,
}: Prancheta8CardProps) {
  return (
    <NextImage
      src="/brand/Prancheta_8-removebg-preview.png"
      alt="Cuidar, antes da necessidade, é um ato de amor."
      width={MANIFESTO_CARD_W}
      height={MANIFESTO_CARD_H}
      priority={priority}
      className={className}
      sizes={`(max-width: 768px) 90vw, ${Math.min(widthPx, 420)}px`}
      style={{
        width: widthPx,
        maxWidth: '100%',
        height: 'auto',
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}
