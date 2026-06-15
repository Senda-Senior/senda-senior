/**
 * por-quem-viveu.ts
 * Dados das 2 fundadoras (bios, credenciais, foto paths) — layout alternado foto/texto
 *
 * Conecta: nenhuma | importado por PorQuemViveu.tsx
 * Camada: shared
 */

export type Founder = {
  name: string
  role: string
  bio: string
  credentials?: string[]
  reverse: boolean
}

export const FOUNDERS: Founder[] = [
  {
    name: 'Julianne Pimentel',
    role: 'Co-Fundadora',
    bio: 'Durante oito anos, estive ao lado da minha mãe em cada passo do seu envelhecer. Sem manual, sem preparo, apenas com o amor e a urgência de quem aprende enquanto cuida. Eu e minhas irmãs dividimos todo processo, que não era só físico, mas emocional.\n\nFoi nesse terreno frágil, feito de tentativas e lágrimas silenciosas, que compreendi o quanto o cuidado exige mais do que boa vontade. E, justamente por ter vivido o que tantas famílias vivem, transformei essa dor em propósito: oferecer às outras pessoas o caminho estruturado, humano e possível que faltou para nós.',
    credentials: [
      'Administradora, pós-graduada em Economia Criativa e Inovação Digital pelo UniCEUB.',
    ],
    reverse: false,
  },
  {
    name: 'Luciana Moura',
    role: 'Co-Fundadora',
    bio: 'Jamais imaginei que viveria a experiência de cuidar tão de perto da minha mãe, hoje com 92 anos. Quando a responsabilidade chegou, sem aviso, sem instruções, precisei aprender a lidar com decisões difíceis, enquanto tentava, ao mesmo tempo, administrar o cuidado sozinha e o desejo profundo de acertar.\n\nEntre rotinas improvisadas, noites inquietas, fui desenvolvendo um olhar mais atento, prático e realista para as necessidades do envelhecimento e do cuidador principal. Tudo isso transformou-se no alicerce do que pretendemos oferecer a outras famílias: um planejamento organizado e sensível, com foco no envelhecimento digno e mais tranquilo.',
    credentials: [
      'Advogada, pós-graduada em Direito Empresarial e Contratos pelo UniCEUB.',
      'Pedagoga, pós-graduada em Psicopedagogia pela UniDF.',
    ],
    reverse: true,
  },
]

export const FOUNDER_PHOTOS: Record<string, string> = {
  'Luciana Moura': '/LUCIANA FOTO.webp',
  'Julianne Pimentel': '/JULIANNE FOTO.webp',
}
