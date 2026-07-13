/**
 * header.ts
 * Dados de navegação principal — links âncora para seções, tipos reutilizáveis
 *
 * Conecta: importa NavLink de types.ts | importado por Header.tsx
 * Camada: shared
 */

import type { NavLink } from './types'

export type HeaderNavLink = NavLink & { chevron?: true }

// Âncoras absolutas ('/#seção') para o Header funcionar fora da home
// (ex.: /manuais/[slug]); na própria landing o comportamento é idêntico.
export const NAV_LINKS: HeaderNavLink[] = [
  { label: 'Início',    href: '/#hero' },
  { label: 'Sobre',     href: '/#sobre' },
  { label: 'Manuais',   href: '/#manuais' },
  { label: 'Serviços',  href: '/#por-quem-viveu' },
  { label: 'Conteúdos', href: '/#conteudo' },
  { label: 'Contato',   href: '/#contato' },
]
