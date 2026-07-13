/**
 * fases-cuidado.ts
 * Dados dos 3 manuais (Prevent Care, Care, Immediate Care) com cores, links Hotmart, copycards
 *
 * Conecta: nenhuma | importado por ManuaisSection.tsx
 * Camada: shared
 */

/**
 * Evento de janela para pré-selecionar um manual na ManuaisSection a partir de outra
 * seção (ex.: resultado do quiz na metodologia). `detail` = índice em MANUAIS.
 * Desacopla as seções sem store global; a ManuaisSection escuta e seleciona.
 */
export const SELECT_MANUAL_EVENT = 'senda:select-manual'

export type Manual = {
  id: number
  slug: string
  tab: string
  photo: string
  capa: string
  momento: string
  title: string
  tagline: string
  desc: string
  lede: string
  includes: string[]
  quote: string
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
    slug: 'prevent-care',
    tab: 'Prevent Care',
    photo: '/brand/photos/prevent-care.webp',
    capa: '/brand/manuais/prevent-care.webp',
    momento: 'Primeiro momento do cuidado',
    title: 'Prevent\nCare',
    tagline: 'Cuidar preventivamente é se organizar enquanto ainda está tudo bem.',
    desc: 'Planejamento preventivo para famílias com pais autônomos.',
    lede: 'Para famílias que desejam se preparar para o envelhecimento de seus pais antes que situações de urgência aconteçam. Um guia para planejar o futuro com organização, segurança e tranquilidade.',
    includes: [
      'Manual digital completo em PDF',
      'Orientações práticas para o planejamento do envelhecimento',
      'Checklists e ferramentas de organização familiar',
      'Estratégias para prevenção, diálogo e tomada de decisões',
    ],
    quote: 'Cuidar preventivamente é se organizar enquanto ainda está tudo bem.',
    // Card: sage green
    cardBg: 'rgba(198, 212, 188, 0.97)',
    labelColor: '#3a5c3a',
    titleColor: 'var(--color-forest)',
    taglineColor: 'var(--color-forest)',
    descColor: 'var(--color-forest-60)',
    btnBg: 'var(--color-forest)',
    btnColor: 'var(--color-cream)',
    link: 'https://go.hotmart.com/D106593830F',
  },
  {
    id: 1,
    slug: 'care',
    tab: 'Care',
    photo: '/brand/photos/care.webp',
    capa: '/brand/manuais/care.webp',
    momento: 'Segundo momento do cuidado',
    title: 'Care',
    tagline: 'O guia para quem já percebeu os primeiros sinais.',
    desc: 'Idosos funcionais, mas que já sinalizam a necessidade de apoio.',
    lede: 'Para famílias que já convivem com as primeiras mudanças: a pessoa idosa mantém parte da autonomia, mas começa a precisar de apoio no dia a dia. Organização da rotina, do ambiente e das responsabilidades.',
    includes: [
      'Manual digital completo em PDF',
      'Orientações práticas e checklists',
      'Estratégias para organização da rotina e do cuidado',
      'Ferramentas para apoiar decisões com mais tranquilidade',
    ],
    quote: 'Planejar e organizar o cuidado é uma demonstração de amor.',
    // Card: warm golden / tan
    cardBg: 'rgba(208, 170, 110, 0.97)',
    labelColor: '#5c3a18',
    titleColor: 'var(--color-brown-deep)',
    taglineColor: 'var(--color-brown-deep)',
    descColor: 'var(--color-brown-deep-60)',
    btnBg: 'var(--color-terracotta)',
    btnColor: 'var(--color-cream)',
    link: 'https://go.hotmart.com/S106604300P',
  },
  {
    id: 2,
    slug: 'immediate-care',
    tab: 'Immediate Care',
    photo: '/brand/photos/immediate-care.webp',
    capa: '/brand/manuais/immediate-care.webp',
    momento: 'Terceiro momento do cuidado',
    title: 'Immediate\nCare',
    tagline: 'O guia para quem precisa agir agora.',
    desc: 'Organização e suporte para famílias que não podem mais esperar.',
    lede: 'Para famílias que enfrentam o cuidado intensivo e precisam organizar a assistência 24 horas: rotina, segurança, gestão financeira e jurídica, e a proteção do cuidador principal.',
    includes: [
      'Manual digital completo em PDF',
      'Orientações práticas para a gestão do cuidado 24h',
      'Checklists de segurança e organização de rotina',
      'Estratégias para planejamento jurídico, financeiro e decisões críticas',
    ],
    quote: 'O afeto precisa de estratégia para ser sustentável.',
    // Card: terracotta / burnt sienna
    cardBg: 'rgba(148, 72, 50, 0.97)',
    labelColor: 'var(--color-cream-75)',
    titleColor: 'var(--color-cream)',
    taglineColor: 'var(--color-cream)',
    descColor: 'var(--color-cream-55)',
    btnBg: 'var(--color-gold-warm)',
    btnColor: 'var(--color-brown-deep)',
    link: 'https://go.hotmart.com/N106604451G',
  },
]

export function getManualBySlug(slug: string): Manual | undefined {
  return MANUAIS.find((m) => m.slug === slug)
}
