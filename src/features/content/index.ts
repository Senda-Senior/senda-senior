/**
 * index.ts
 * Barrel do domínio de leitura de conteúdos públicos (artigos).
 *
 * Conecta: ArticlePageFrame, layout /artigos
 * Camada: shared
 */

export { ContentReader } from './components/ContentReader'
export type { ContentReaderProps, ContentTocItem } from './components/ContentReader'
export { ReaderBodyLock } from './components/ReaderBodyLock'
