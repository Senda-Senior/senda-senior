/**
 * ─── Design System — Senda Sênior ──────────────────────────────────
 *
 * Primitivos de UI sóbrios, alinhados ao Guia_Desenvolvedor.md.
 * Regras:
 *   - Sem dependência de features. `src/design/*` não importa de
 *     `src/features/*` nem de `src/app/*`.
 *   - Componentes exportam apenas o necessário: o tipo das props e
 *     o componente em si.
 *   - Se você precisa de uma variante nova, adicione-a DENTRO do
 *     primitivo (não bifurque em um novo componente).
 * ───────────────────────────────────────────────────────────────────
 */

export { cn } from './cn'

export { AppPageShell, AppPageContainer, AppPageHeader, AppPageCard } from './AppPage'
export type {
  AppPageShellProps,
  AppPageContainerProps,
  AppPageHeaderProps,
  AppPageCardProps,
} from './AppPage'

export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Card } from './Card'
export type { CardProps } from './Card'

export { Divider } from './Divider'
export type { DividerProps } from './Divider'

export { Field } from './Field'
export type { FieldProps } from './Field'

export { Label } from './Label'
export type { LabelProps } from './Label'

export { Reveal } from './Reveal'
export type { RevealProps } from './Reveal'

export { Section } from './Section'
export type { SectionProps } from './Section'

export { Skeleton } from './Skeleton'
export type { SkeletonProps } from './Skeleton'

export { ConfirmDialog } from './ConfirmDialog'
export type { ConfirmDialogProps } from './ConfirmDialog'

export { Skeleton } from './Skeleton'
export type { SkeletonProps } from './Skeleton'

export { ErrorBoundary } from './ErrorBoundary'
export type { ErrorBoundaryProps } from './ErrorBoundary'
