/**
 * ─── Shared types for landing page data ─────────────────────────────────
 *
 * Types co-located with their data file are NOT exported from here.
 * This file holds only types used across MULTIPLE data files (e.g. NavLink
 * appears in both header.ts and footer.ts).
 *
 * Importing pattern:
 *   import { SERVICOS } from '@/features/landing/data/servicos'      // bespoke type lives in servicos.ts
 *   import type { NavLink } from '@/features/landing/data/types'    // shared type
 * ────────────────────────────────────────────────────────────────────────
 */

/** A single navigation link — used in Header.NAV_LINKS and Footer.NAV_COLUMNS. */
export type NavLink = {
  label: string
  href: string
}
