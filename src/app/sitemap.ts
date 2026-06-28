/**
 * sitemap.ts
 * /sitemap.xml gerado pelo Next — só páginas públicas e indexáveis (conteúdo de marketing
 * e artigos). Rotas de app/auth e o manual pago ficam de fora (ver robots.ts).
 *
 * Ao publicar um novo artigo em /artigos, adicione-o aqui.
 * Camada: server (gerado em build)
 */
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://sendasenior.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    {
      url: `${BASE_URL}/artigos/como-conversar-com-seus-pais`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/artigos/documentos-essenciais`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/artigos/qual-fase-de-cuidado`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/termos-de-servico`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-privacidade`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
