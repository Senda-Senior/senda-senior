/**
 * robots.ts
 * /robots.txt gerado pelo Next. Permite todos os crawlers (incl. bots de IA — GPTBot,
 * ClaudeBot, PerplexityBot, Google-Extended caem em `*`) no conteúdo público, e bloqueia
 * rotas de app/auth e o manual pago (RLS por entitlement) — que não devem ser indexadas.
 *
 * Conecta: aponta para /sitemap.xml (sitemap.ts) | metadataBase em app/layout.tsx
 * Camada: server (gerado em build)
 */
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://sendasenior.com.br'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/vault',
          '/configuracoes',
          '/settings',
          '/profile',
          '/health',
          '/financial',
          '/help',
          '/pricing',
          '/rede-de-confianca',
          '/login',
          '/update-password',
          '/auth/',
          '/manual', // produto pago (RLS por entitlement) — anônimo vê vazio
          '/em-construcao',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
