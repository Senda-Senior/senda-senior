/**
 * Data for `src/features/landing/components/ManuaisSection.tsx`.
 *
 * NOTE on inline color literals (#3a5c3a, #5c3a18, rgba(198,212,188,0.97), etc):
 * Each phase card has a unique palette by design — these colors ARE data,
 * not tokens. Tokenizing them as --color-phase-N-X would just bloat @theme
 * with single-use vars. Brand colors that ARE reused (e.g. brown-deep,
 * gold-warm) are tokenized; per-card bespoke shades stay inline here.
 * See docs/landing-pattern-budget.md §3.2 (color tokens) for the full rule.
 */

export type Manual = {
  id: number
  tab: string
  photo: string
  title: string
  tagline: string
  desc: string
  cardBg: string
  labelColor: string
  titleColor: string
  taglineColor: string
  descColor: string
  btnBg: string
  btnColor: string
  link: string
}

export const MANUAIS: Manual[] = [
  {
    id: 0,
    tab: 'Prevent Care',
    photo: '/brand/photos/prevent-care.webp',
    title: 'Prevent\nCare',
    tagline: 'Cuidar preventivamente é se organizar enquanto ainda está tudo bem.',
    desc: 'Planejamento preventivo para famílias com pais autônomos.',
    // Card: sage green
    cardBg: 'rgba(198, 212, 188, 0.97)',
    labelColor: '#3a5c3a',
    titleColor: 'var(--color-forest)',
    taglineColor: 'var(--color-forest)',
    descColor: 'var(--color-forest-60)',
    btnBg: 'var(--color-forest)',
    btnColor: 'var(--color-cream)',
    link: 'https://hotmart.com/pt-br', // TODO: Inserir link de checkout real do Prevent Care
  },
  {
    id: 1,
    tab: 'Care',
    photo: '/brand/photos/care.webp',
    title: 'Care',
    tagline: 'O guia para quem já percebeu os primeiros sinais.',
    desc: 'Idosos funcionais, mas que já sinalizam a necessidade de apoio.',
    // Card: warm golden / tan
    cardBg: 'rgba(208, 170, 110, 0.97)',
    labelColor: '#5c3a18',
    titleColor: 'var(--color-brown-deep)',
    taglineColor: 'var(--color-brown-deep)',
    descColor: 'var(--color-brown-deep-60)',
    btnBg: 'var(--color-terracotta)',
    btnColor: 'var(--color-cream)',
    link: 'https://hotmart.com/pt-br', // TODO: Inserir link de checkout real do Care
  },
  {
    id: 2,
    tab: 'Immediate Care',
    photo: '/brand/photos/immediate-care.webp',
    title: 'Immediate\nCare',
    tagline: 'O guia para quem precisa agir agora.',
    desc: 'Organização e suporte para famílias que não podem mais esperar.',
    // Card: terracotta / burnt sienna
    cardBg: 'rgba(148, 72, 50, 0.97)',
    labelColor: 'var(--color-cream-75)',
    titleColor: 'var(--color-cream)',
    taglineColor: 'var(--color-cream)',
    descColor: 'var(--color-cream-55)',
    btnBg: 'var(--color-gold-warm)',
    btnColor: 'var(--color-brown-deep)',
    link: 'https://hotmart.com/pt-br', // TODO: Inserir link de checkout real do Immediate Care
  },
]
