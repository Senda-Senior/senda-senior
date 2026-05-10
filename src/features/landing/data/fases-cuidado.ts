/**
 * Data for `src/features/landing/components/FasesCuidado.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
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
    photo: '/brand/photos/prevent-care.png',
    title: 'Prevent\nCare',
    tagline: 'Cuidar preventivamente é se organizar enquanto ainda está tudo bem.',
    desc: 'Planejamento preventivo para famílias com pais autônomos.',
    // Card: sage green
    cardBg: 'rgba(198, 212, 188, 0.97)',
    labelColor: '#3a5c3a',
    titleColor: '#1e3320',
    taglineColor: '#1e3320',
    descColor: 'rgba(30, 51, 32, 0.6)',
    btnBg: '#1e3320',
    btnColor: '#f5f0e8',
    link: 'https://hotmart.com/pt-br', // TODO: Inserir link de checkout real do Prevent Care
  },
  {
    id: 1,
    tab: 'Care',
    photo: '/brand/photos/care.png',
    title: 'Care',
    tagline: 'O guia para quem já percebeu os primeiros sinais.',
    desc: 'Idosos funcionais, mas que já sinalizam a necessidade de apoio.',
    // Card: warm golden / tan
    cardBg: 'rgba(208, 170, 110, 0.97)',
    labelColor: '#5c3a18',
    titleColor: '#3a2008',
    taglineColor: '#3a2008',
    descColor: 'rgba(58, 32, 8, 0.6)',
    btnBg: 'var(--color-terracotta)',
    btnColor: '#f5f0e8',
    link: 'https://hotmart.com/pt-br', // TODO: Inserir link de checkout real do Care
  },
  {
    id: 2,
    tab: 'Immediate Care',
    photo: '/brand/photos/immediate-care.png',
    title: 'Immediate\nCare',
    tagline: 'O guia para quem precisa agir agora.',
    desc: 'Organização e suporte para famílias que não podem mais esperar.',
    // Card: terracotta / burnt sienna
    cardBg: 'rgba(148, 72, 50, 0.97)',
    labelColor: 'rgba(245, 240, 232, 0.75)',
    titleColor: '#f5f0e8',
    taglineColor: '#f5f0e8',
    descColor: 'rgba(245, 240, 232, 0.55)',
    btnBg: '#D4AA6A',
    btnColor: '#3a2008',
    link: 'https://hotmart.com/pt-br', // TODO: Inserir link de checkout real do Immediate Care
  },
]
