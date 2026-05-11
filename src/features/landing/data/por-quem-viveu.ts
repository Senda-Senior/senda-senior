/**
 * Data for `src/features/landing/components/PorQuemViveu.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
 */

export type Founder = {
  name: string
  role: string
  bio: string
  reverse: boolean
}

export const FOUNDERS: Founder[] = [
  {
    name: 'Luciana Moura',
    role: 'Co-Fundadora',
    bio: 'Vivo pessoalmente o desafio e a responsabilidade de cuidar de minha mãe idosa de 92 anos. Essa experiência transformou-se em método e orientação para outras famílias que precisam se preparar, não improvisar.',
    reverse: false,
  },
  {
    name: 'Julianne Pimentel',
    role: 'Co-Fundadora',
    bio: 'Acompanhou de perto o envelhecimento de sua mãe, enfrentando cada etapa sem preparo. Hoje, oferece a outras famílias o caminho estruturado que faltou para ela.',
    reverse: true,
  },
]

export const FOUNDER_PHOTOS: Record<string, string> = {
  'Luciana Moura':    '/brand/photos/founder-luciana.png',
  'Julianne Pimentel':'/brand/photos/founder-julianne.png',
}
