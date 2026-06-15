'use client'

/**
 * BrandDecorative.tsx
 * Elementos SVG decorativos da marca — S-curve, compass rose, star scatter, section dividers, quote marks
 *
 * Conecta: nenhum | usado como overlays em seções
 * Camada: browser
 */
'use client'

interface DecoProps {
  className?: string
  style?: React.CSSProperties
  color?: string
  secondaryColor?: string
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   S-CURVE — The flowing "Senda" path (Prancheta 7 vocabulary)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function SCurveDecoration({
  className,
  style,
  color = 'var(--color-gold-light)',
}: DecoProps) {
  return (
    <svg
      viewBox="0 0 400 600"
      fill="none"
      className={className}
      style={{ width: '100%', height: 'auto', ...style }}
      aria-hidden="true"
    >
      {/* Main S ribbon — thick flowing path */}
      <path
        d="M-20 0 C-20 0 80 40 160 120 C240 200 120 260 200 340 C280 420 380 380 420 460 C460 540 340 580 340 600"
        stroke={color}
        strokeWidth="80"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Inner S highlight */}
      <path
        d="M-20 0 C-20 0 80 40 160 120 C240 200 120 260 200 340 C280 420 380 380 420 460 C460 540 340 580 340 600"
        stroke={color}
        strokeWidth="40"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  )
}

/** Fragment S — cropped at edges, for use as background watermark */
export function SCurveFragment({
  className,
  style,
  color = 'var(--color-terracotta)',
}: DecoProps) {
  return (
    <svg
      viewBox="0 0 500 700"
      fill="none"
      className={className}
      style={{ width: '100%', height: 'auto', ...style }}
      aria-hidden="true"
    >
      <path
        d="M-60 -40 C40 20 180 60 220 160 C260 260 80 300 120 400 C160 500 340 460 380 560 C420 660 280 720 200 760"
        stroke={color}
        strokeWidth="110"
        strokeLinecap="round"
        fill="none"
        opacity="0.12"
      />
    </svg>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMPASS ROSE — Navigational star (brand's "guiding" metaphor)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function CompassRose({
  className,
  style,
  color = 'var(--color-green)',
  secondaryColor = 'var(--color-terracotta)',
}: DecoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={{ width: '100%', height: 'auto', ...style }}
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="100" cy="100" r="90" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="0.5" opacity="0.15" />

      {/* Main 4-point star — elongated N/S */}
      <path d="M100 10 L108 85 L100 75 L92 85 Z" fill={color} opacity="0.9" />
      <path d="M100 190 L108 115 L100 125 L92 115 Z" fill={color} opacity="0.5" />
      <path d="M10 100 L85 92 L75 100 L85 108 Z" fill={color} opacity="0.5" />
      <path d="M190 100 L115 92 L125 100 L115 108 Z" fill={color} opacity="0.5" />

      {/* Secondary 4-point star — rotated 45° (NE/SE/SW/NW) */}
      <path d="M137 37 L110 90 L106 86 Z" fill={secondaryColor} opacity="0.6" />
      <path d="M163 163 L110 110 L114 106 Z" fill={secondaryColor} opacity="0.4" />
      <path d="M37 163 L90 110 L86 114 Z" fill={secondaryColor} opacity="0.4" />
      <path d="M63 37 L90 90 L94 86 Z" fill={secondaryColor} opacity="0.6" />

      {/* Center dot */}
      <circle cx="100" cy="100" r="4" fill={secondaryColor} />

      {/* Tiny accent stars at cardinal points */}
      <path d="M100 4 L101.5 7 L100 6 L98.5 7 Z" fill={color} opacity="0.6" />
      <path d="M196 100 L193 101.5 L194 100 L193 98.5 Z" fill={color} opacity="0.4" />
    </svg>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STAR SCATTER — Constellation of brand stars
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** A single four-pointed star path for reuse in scatter compositions */
function StarPath({ cx, cy, size, color, opacity = 1 }: {
  cx: number; cy: number; size: number; color: string; opacity?: number
}) {
  const h = size / 2
  return (
    <path
      d={`M${cx} ${cy - h} C${cx} ${cy - h} ${cx + h * 0.35} ${cy - h * 0.35} ${cx + h} ${cy}
          C${cx + h} ${cy} ${cx + h * 0.35} ${cy + h * 0.35} ${cx} ${cy + h}
          C${cx} ${cy + h} ${cx - h * 0.35} ${cy + h * 0.35} ${cx - h} ${cy}
          C${cx - h} ${cy} ${cx - h * 0.35} ${cy - h * 0.35} ${cx} ${cy - h} Z`}
      fill={color}
      opacity={opacity}
    />
  )
}

export function StarScatter({
  className,
  style,
}: DecoProps) {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      className={className}
      style={{ width: '100%', height: 'auto', ...style }}
      aria-hidden="true"
    >
      {/* Large stars */}
      <StarPath cx={60} cy={80} size={48} color="var(--color-green)" opacity={0.7} />
      <StarPath cx={110} cy={60} size={42} color="var(--color-green-dark)" opacity={0.5} />
      <StarPath cx={85} cy={130} size={44} color="var(--color-terracotta)" opacity={0.65} />
      <StarPath cx={140} cy={115} size={40} color="var(--color-gold)" opacity={0.55} />

      {/* Medium stars */}
      <StarPath cx={200} cy={45} size={28} color="var(--color-terracotta-light)" opacity={0.5} />
      <StarPath cx={240} cy={90} size={32} color="var(--color-green)" opacity={0.35} />
      <StarPath cx={180} cy={150} size={24} color="var(--color-gold-light)" opacity={0.45} />

      {/* Small accent stars */}
      <StarPath cx={30} cy={30} size={12} color="var(--color-terracotta)" opacity={0.3} />
      <StarPath cx={270} cy={40} size={14} color="var(--color-green)" opacity={0.25} />
      <StarPath cx={160} cy={20} size={10} color="var(--color-gold)" opacity={0.35} />
      <StarPath cx={260} cy={170} size={16} color="var(--color-terracotta)" opacity={0.2} />
      <StarPath cx={40} cy={170} size={8} color="var(--color-green-light)" opacity={0.3} />
    </svg>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION DIVIDER — Abstract flowing line with star accents
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function SectionDivider({
  className,
  style,
  color = 'var(--color-terracotta)',
}: DecoProps) {
  return (
    <svg
      viewBox="0 0 800 40"
      fill="none"
      className={className}
      style={{ width: '100%', height: 'auto', ...style }}
      aria-hidden="true"
    >
      {/* Flowing line */}
      <path
        d="M0 20 C100 20 150 8 250 12 C350 16 380 28 450 20 C520 12 560 24 650 20 C740 16 770 20 800 20"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
      />
      {/* Star accents */}
      <StarPath cx={250} cy={12} size={8} color={color} opacity={0.5} />
      <StarPath cx={450} cy={20} size={6} color="var(--color-gold)" opacity={0.4} />
      <StarPath cx={650} cy={20} size={10} color={color} opacity={0.35} />
    </svg>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BRAND QUOTE MARKS — Editorial quotation marks
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function QuoteMark({
  className,
  style,
  color = 'var(--color-terracotta)',
}: DecoProps & { size?: number }) {
  return (
    <svg
      viewBox="0 0 60 48"
      fill={color}
      className={className}
      style={{ width: 60, height: 'auto', ...style }}
      aria-hidden="true"
    >
      <path
        d="M0 28.8C0 18.36 3.6 10.68 12 4.8L16.8 10.8C11.4 14.76 8.4 19.56 8.4 24H16.8C16.8 30.6 12.6 36 6 36C2.4 36 0 33.6 0 28.8Z"
        opacity="0.25"
      />
      <path
        d="M28.8 28.8C28.8 18.36 32.4 10.68 40.8 4.8L45.6 10.8C40.2 14.76 37.2 19.56 37.2 24H45.6C45.6 30.6 41.4 36 34.8 36C31.2 36 28.8 33.6 28.8 28.8Z"
        opacity="0.25"
      />
    </svg>
  )
}
