/**
 * index.ts
 * Barrel export do módulo manual — expõe dados dos capítulos, tipos, e componente leitor.
 *
 * Conecta: expõe manualChapters, getChapterBySlug, getChapterSlugs, DigitalReader, ManualChapter | importado por rotas /manual/[slug]
 * Camada: shared
 */

export { manualChapters, getChapterBySlug, getChapterSlugs } from './data'
export { DigitalReader } from './components/DigitalReader'
export type { DigitalReaderProps } from './components/DigitalReader'
export type { ManualChapter } from './types'
