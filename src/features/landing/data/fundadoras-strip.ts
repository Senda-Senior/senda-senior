/**
 * Data for `src/features/landing/components/FundadorasStrip.tsx`.
 * Extracted from inline const (landing refactor).
 */

export type FundadoraCard = {
  id: 'manuais' | 'assessoria' | 'repositorio' | 'parceiros'
  icon: 'book-open' | 'heart-handshake' | 'files' | 'users'
  title: string
  desc: string
  bg: string
}

export const CARDS: FundadoraCard[] = [
  {
    id: 'manuais',
    icon: 'book-open',
    title: 'Os manuais',
    desc: 'Guias práticos para cada momento do cuidado.',
    bg: 'var(--color-terracotta-light)',
  },
  {
    id: 'assessoria',
    icon: 'heart-handshake',
    title: 'A assessoria personalizada',
    desc: 'Orientação individual para prioridades reais da família.',
    bg: 'var(--color-gold-light)',
  },
  {
    id: 'repositorio',
    icon: 'files',
    title: 'O repositório',
    desc: 'Documentos, organização e histórico em um só lugar.',
    bg: 'var(--color-gold-light)',
  },
  {
    id: 'parceiros',
    icon: 'users',
    title: 'Os parceiros',
    desc: 'Rede de cuidadores, fisioterapeutas, clínicas e ILPIs.',
    bg: 'var(--color-terracotta-light)',
  },
]
