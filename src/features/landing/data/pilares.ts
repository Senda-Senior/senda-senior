/**
 * Data for `src/features/landing/components/Pilares.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
 */

import { createElement, type ReactNode } from 'react'
import { MessageCircle, FolderOpen, ShieldCheck, Users } from 'lucide-react'

export type Pilar = {
  icon: ReactNode
  label: string
  title: string
  text: string
  image: string
  imageAlt: string
  accentStar: string
}

export const pilaresData: Pilar[] = [
  {
    icon: createElement(MessageCircle, { size: 28, strokeWidth: 1.5 }),
    label: 'Comunicação',
    title: 'Conversas que constroem, não que assustam.',
    text: 'Você sabe que precisa conversar sobre o futuro dos seus pais — mas não sabe como começar sem gerar drama. O manual ensina a abrir esses diálogos com respeito, no tempo certo, de um jeito que une a família em vez de dividi-la.',
    image: '/brand/photos/prancheta-2.png',
    imageAlt: 'Filha e mãe conversando juntas, com luz natural e jardim ao fundo',
    accentStar: 'var(--color-gold)',
  },
  {
    icon: createElement(FolderOpen, { size: 28, strokeWidth: 1.5 }),
    label: 'Organização',
    title: 'Tudo no lugar, antes que alguém precise procurar.',
    text: 'Documentos pessoais, exames, medicamentos, finanças, contatos de emergência — tudo centralizado e acessível. Porque a organização hoje evita o desespero de amanhã.',
    image: '/brand/photos/prancheta-5.png',
    imageAlt: 'Idoso contemplativo junto à janela, luz natural, plantas ao fundo',
    accentStar: 'var(--color-terracotta)',
  },
  {
    icon: createElement(ShieldCheck, { size: 28, strokeWidth: 1.5 }),
    label: 'Proteção',
    title: 'Decisões tomadas com calma têm mais valor — inclusive legal.',
    text: 'Formalizar escolhas enquanto há plena autonomia protege toda a família. Não é sobre controlar o idoso — é sobre preservar sua autonomia por muito mais tempo, da maneira que ele mesmo escolheu.',
    image: '/brand/photos/prancheta-10.png',
    imageAlt: 'Família reunida em consulta, ambiente acolhedor, mesa de madeira',
    accentStar: 'var(--color-gold-light)',
  },
  {
    icon: createElement(Users, { size: 28, strokeWidth: 1.5 }),
    label: 'Rede de Apoio',
    title: 'Ninguém cuida sozinho.',
    text: 'Mapear quem faz parte da rede de cuidado — família, amigos, vizinhos, profissionais de saúde — faz toda a diferença em um momento de necessidade. O manual te ajuda a estruturar essa rede antes que ela seja urgente.',
    image: '/brand/photos/prancheta-2.png',
    imageAlt: 'Conexão geracional, conversa aberta, ambiente doméstico com luz natural',
    accentStar: 'var(--color-terracotta)',
  },
]

export const PATTERNS: string[] = [
  '/brand/pattern-estrela-greenmono-claro.png',
  '/brand/pattern-caminho-greenmono-claro.png',
  '/brand/pattern-abstrato-greenmono-claro.png',
  '/brand/pattern-estrela-greenmono-claro.png',
]

export const BG: string[] = [
  'var(--color-cream)',
  'var(--color-cream-mid)',
  'var(--color-cream)',
  'var(--color-cream-mid)',
]
