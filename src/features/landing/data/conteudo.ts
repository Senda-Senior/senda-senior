/**
 * Data for `src/features/landing/components/Conteudo.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
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
}

export const ARTIGOS: Artigo[] = [
  {
    tag: 'FAMÍLIA',
    title: 'Como conversar com seus pais sobre o futuro sem que ninguém fuja da mesa',
    author: 'Julianne Pimentel',
    date: 'Mar 12, 2026 - 5 mins de leitura',
    bg: '#B8C9AE',
    titleColor: '#1e2e1e',
    tagColor: 'rgba(30, 46, 30, 0.6)',
    photo: '/conversa-pais.png',
  },
  {
    tag: 'ORGANIZAÇÃO',
    title: '5 documentos que toda família deveria ter prontos antes dos 70 anos dos pais',
    author: 'Luciana Moura',
    date: 'Mar 03, 2026 - 6 mins de leitura',
    bg: '#EBD197',
    titleColor: '#6B3A18',
    tagColor: 'rgba(107, 58, 24, 0.65)',
    photo: '/5-documentos.png',
  },
  {
    tag: 'MÉTODO',
    title: 'Em qual fase de cuidado sua família está?',
    author: 'Julianne Pimentel',
    date: 'Mar 19, 2026 - 4 mins de leitura',
    bg: '#EAE5D9',
    titleColor: '#2a2520',
    tagColor: 'rgba(42, 37, 32, 0.55)',
    photo: '/qual-momento.png',
  },
]
