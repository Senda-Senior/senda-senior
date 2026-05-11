/**
 * Data for `src/features/landing/components/FundadorasStrip.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
 */

export type FundadoraCard = {
  icon: string
  title: string
  desc: string
  bg: string
}

export const CARDS: FundadoraCard[] = [
  {
    icon: '/icons/brand/book-open.svg',
    title: 'Os manuais',
    desc: 'Guias práticos para cada momento do cuidado.',
    bg: 'var(--color-terracotta-light)',
  },
  {
    icon: '/icons/brand/heart-hand.svg',
    title: 'A assessoria personalizada',
    desc: 'Orientação individual para prioridades reais da família.',
    bg: 'var(--color-gold-light)',
  },
  {
    icon: '/icons/brand/file-content.svg',
    title: 'O repositório',
    desc: 'Documentos, organização e histórico em um só lugar.',
    bg: 'var(--color-gold-light)',
  },
  {
    icon: '/icons/brand/users.svg',
    title: 'Os parceiros',
    desc: 'Rede de cuidadores, fisioterapeutas, clínicas e ILPIs.',
    bg: 'var(--color-terracotta-light)',
  },
]
