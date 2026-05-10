/**
 * Data for `src/features/landing/components/QuemSomos.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
 */

export type Fundadora = {
  nome: string
  formacao: string
  frase: string
  photo: string
  stars: string[]
  tagline: string
}

export const FUNDADORAS: Fundadora[] = [
  {
    nome: 'Luciana M. Moura',
    formacao:
      'Advogada · Pós-graduada em Direito Empresarial e Contratos (UniCEUB) · Pedagoga · Pós-graduada em Psicopedagogia (UniDF)',
    frase: 'Combina rigor jurídico com sensibilidade pedagógica para transformar processos complexos em caminhos claros e humanos.',
    photo: '/brand/photos/prancheta-10.png',
    /* star accent colors — Prancheta 10 palette */
    stars: ['var(--color-green)', 'var(--color-terracotta)', 'var(--color-cream-dark)'],
    tagline: 'Um guia moderno sobre afeto.',
  },
  {
    nome: 'Julianne Q. Pimentel',
    formacao:
      'Administradora · Pós-graduada em Economia Criativa e Inovação Digital (UniCEUB)',
    frase: 'Traz estrutura, visão sistêmica e inovação para organizar processos familiares com eficiência e cuidado.',
    photo: '/brand/photos/prancheta-5.png',
    stars: ['var(--color-terracotta)', 'var(--color-gold)', 'var(--color-gold-light)'],
    tagline: 'Clareza. Organização. Tranquilidade.',
  },
]
