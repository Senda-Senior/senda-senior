/**
 * types.ts
 * Tipos compartilhados entre múltiplos data files da landing — NavLink reutilizado em header e footer
 *
 * Conecta: importado por header.ts, footer.ts | nenhuma dependência
 * Camada: shared
 */

/** A single navigation link — used in Header.NAV_LINKS and Footer.NAV_COLUMNS. */
export type NavLink = {
  label: string
  href: string
}
