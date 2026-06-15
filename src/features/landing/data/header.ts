/**
 * header.ts
 * Dados de navegação principal — links âncora para seções, tipos reutilizáveis
 *
 * Conecta: importa NavLink de types.ts | importado por Header.tsx
 * Camada: shared
 */

import type { NavLink } from './types'

export type HeaderNavLink = NavLink & { chevron?: true }

export const NAV_LINKS: HeaderNavLink[] = [
  { label: 'Início',    href: '#hero' },
  { label: 'Sobre',     href: '#por-quem-viveu' },
  { label: 'Manuais',   href: '#manual' },
  { label: 'Serviços',  href: '#sobre' },
  { label: 'Conteúdos', href: '#conteudo' },
  { label: 'Contato',   href: '#contato' },
]
