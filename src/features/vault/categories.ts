/**
 * categories.ts
 * Catálogo de categorias sistema — slugs, tipos e metadata (ícones, cores)
 *
 * Conecta: importado por classifier.ts (validar slugs), data.ts (queries), actions.ts, componentes
 * Camada: shared
 */

/**
 * catálogo de categorias sistema. espelho das seeds em
 * supabase/migrations/0002_vault.sql.
 *
 * usado pelo classifier (saber os slugs disponíveis) e pela ui
 * (mostrar enquanto a query pro banco não retorna).
 */

export const SYSTEM_CATEGORY_SLUGS = [
  'juridico',
  'saude',
  'financeiro',
  'trabalho',
  'viagem',
  'imoveis',
  'seguros',
  'previdencia',
  'familia',
  'pessoal',
  'outros',
] as const

export type SystemCategorySlug = (typeof SYSTEM_CATEGORY_SLUGS)[number]

export const FALLBACK_CATEGORY: SystemCategorySlug = 'outros'

export const SYSTEM_CATEGORIES_META: Record<
  SystemCategorySlug,
  { label: string; icon: string; color: string }
  > = {
    juridico: { label: 'Jurídico', icon: 'Scale', color: '#2D5F4F' },
    saude: { label: 'Saúde', icon: 'Heart', color: '#B5724A' },
    financeiro: { label: 'Financeiro', icon: 'Wallet', color: '#6B5B4E' },
    trabalho: { label: 'Trabalho', icon: 'Briefcase', color: '#3F6E5A' },
    viagem: { label: 'Viagem', icon: 'Plane', color: '#7A8B6F' },
    imoveis: { label: 'Imóveis', icon: 'Home', color: '#8A6A50' },
    seguros: { label: 'Seguros', icon: 'Shield', color: '#5A6B5F' },
    previdencia: { label: 'Previdência', icon: 'PiggyBank', color: '#7A6B5A' },
    familia: { label: 'Família', icon: 'Users', color: '#8A7B6A' },
    pessoal: { label: 'Pessoal', icon: 'User', color: '#5B5045' },
    outros: { label: 'Outros', icon: 'Folder', color: '#999999' },
  }

export function isSystemCategory(slug: string): slug is SystemCategorySlug {
  return (SYSTEM_CATEGORY_SLUGS as readonly string[]).includes(slug)
}
