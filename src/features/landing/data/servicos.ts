/**
 * Data for `src/features/landing/components/Servicos.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
 */

export type Servico = {
  /** Path to an SVG icon under /public/. */
  iconSrc: string
  titulo: string
  descricao: string
}

export const SERVICOS: Servico[] = [
  {
    iconSrc: '/brand/icons/handshake-outline-18.svg',
    titulo: 'Consultoria Individual e Familiar',
    descricao:
      'Acompanhamento personalizado para mapear a situação atual da família e construir um plano de cuidado sob medida.',
  },
  {
    iconSrc: '/brand/icons/clipboard-check-outline-18.svg',
    titulo: 'Documentação Formalizada',
    descricao:
      'Organização e formalização dos documentos essenciais com orientação jurídica e administrativa.',
  },
  {
    iconSrc: '/brand/icons/users-outline-18.svg',
    titulo: 'Mediação de Conversas Difíceis',
    descricao:
      'Facilitamos diálogos sobre saúde, finanças e decisões futuras respeitando a autonomia de todos.',
  },
]
