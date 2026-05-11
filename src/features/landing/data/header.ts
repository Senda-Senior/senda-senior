/**
 * Data for `src/features/landing/components/Header.tsx`.
 * Phase 1 of refactor/landing-coherence — extracted from inline const.
 */

import type { NavLink } from './types'

export type HeaderNavLink = NavLink & { chevron?: true }

export const NAV_LINKS: HeaderNavLink[] = [
  { label: 'Início',    href: '/' },
  { label: 'Sobre',     href: '#sobre' },
  { label: 'Manuais',   href: '#manual' },
  { label: 'Serviços',  href: '#servicos', chevron: true },
  { label: 'Conteúdos', href: '#conteudo' },
  { label: 'Contato',   href: '#contato' },
]
