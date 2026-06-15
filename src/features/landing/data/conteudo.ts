/**
 * conteudo.ts
 * Dados de 3 artigos educativos com meta, autor, foto, cor de fundo — grid cards
 *
 * Conecta: nenhuma | importado por Conteudo.tsx
 * Camada: shared
 */

export type Artigo = {
  tag: string
  title: string
  author: string
  date: string
  bg: string
  titleColor: string
  tagColor: string
  photo: string
  href: string
}

export const ARTIGOS: Artigo[] = [
  {
    tag: 'FAMÍLIA',
    title: 'Como conversar com seus pais sobre o futuro sem que ninguém fuja da mesa',
    author: 'Julianne Pimentel',
    date: 'Mar 12, 2026 - 5 mins de leitura',
    bg: 'var(--color-sage-light)',
    titleColor: 'var(--color-forest-dark)',
    tagColor: 'var(--color-forest-60)',
    photo: '/conversa-pais.webp',
    href: '/artigos/como-conversar-com-seus-pais',
  },
  {
    tag: 'ORGANIZAÇÃO',
    title: '4 documentos que toda família deveria ter prontos antes dos 70 anos dos pais',
    author: 'Luciana Moura',
    date: 'Mar 03, 2026 - 6 mins de leitura',
    bg: 'var(--color-golden-beige)',
    titleColor: 'var(--color-brown-rich)',
    tagColor: 'var(--color-brown-rich-65)',
    photo: '/5-documentos.webp',
    href: '/artigos/documentos-essenciais',
  },
  {
    tag: 'MÉTODO',
    title: 'Em qual fase de cuidado sua família está?',
    author: 'Julianne Pimentel',
    date: 'Mar 19, 2026 - 4 mins de leitura',
    bg: 'var(--color-warm-cream)',
    titleColor: 'var(--color-ink)',
    tagColor: 'var(--color-ink-55)',
    photo: '/qual-momento.webp',
    href: '/em-construcao',
  },
]
