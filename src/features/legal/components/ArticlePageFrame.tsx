/**
 * ArticlePageFrame.tsx
 * Frame de artigo educativo — JSON-LD + ContentReader (índice, modo foco, brand).
 *
 * Conecta: ContentReader | ARTIGOS (landing/data/conteudo) | páginas /artigos/*
 * Camada: server (RSC; shell client aninhado)
 */

import type { ReactNode } from 'react'
import { ContentReader } from '@/features/content'
import { ARTIGOS } from '@/features/landing/data/conteudo'

const SITE = 'https://sendasenior.com.br'

export function ArticlePageFrame({
  eyebrow,
  title,
  author,
  date,
  slug,
  description,
  datePublished,
  children,
}: {
  eyebrow?: string
  title: string
  author: string
  date: string
  /** Slug em /artigos/<slug> — habilita o Article JSON-LD (SEO/GEO). */
  slug?: string
  /** Descrição curta do artigo (para o JSON-LD). */
  description?: string
  /** Data de publicação em ISO 8601 (ex.: 2026-03-03). */
  datePublished?: string
  children: ReactNode
}) {
  const articleLd = slug
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        ...(description ? { description } : {}),
        author: { '@type': 'Person', name: author },
        ...(datePublished ? { datePublished } : {}),
        image: `${SITE}/opengraph-image`,
        inLanguage: 'pt-BR',
        url: `${SITE}/artigos/${slug}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/artigos/${slug}` },
        publisher: {
          '@type': 'Organization',
          name: 'Senda Sênior',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE}/brand/logo-wordmark-dark.png`,
          },
        },
      }
    : null

  const toc = ARTIGOS.map((artigo) => ({
    href: artigo.href,
    title: artigo.title,
    label: artigo.tag,
  }))

  const currentHref = slug ? `/artigos/${slug}` : ''

  return (
    <>
      {articleLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      )}
      <ContentReader
        eyebrow={eyebrow}
        title={title}
        meta={`Por ${author} · ${date}`}
        currentHref={currentHref}
        items={toc}
        homeHref="/#conteudo"
        indexLabel="Conteúdos"
        prevNavLabel="Artigo anterior"
        nextNavLabel="Próximo artigo"
      >
        {children}
      </ContentReader>
    </>
  )
}
