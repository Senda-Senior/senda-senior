/**
 * layout.tsx
 * Root layout da aplicação — fontes (Fraunces serif + DM Sans), SmoothScroll (Lenis), metadata global
 *
 * Conecta: WhatsAppFloat (features/landing) | BfCacheGuard | SmoothScroll
 * Camada: server
 */

import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import { WhatsAppFloat } from '@/features/landing'
import { BfCacheGuard } from '@/lib/utils/BfCacheGuard'
import './globals.css'

export const metadata: Metadata = {
  title: 'Senda Sênior — Planejamento & Assessoria Sênior',
  description:
    'O Manual Prevent Care é o guia prático para famílias que querem organizar o cuidado dos pais idosos antes da urgência. Uma jornada de cuidado e independência.',
  keywords:
    'cuidado preventivo idosos, planejamento familiar, manual prevent care, pais idosos, organização familiar, assessoria sênior',
  authors: [{ name: 'Senda Sênior' }],
  metadataBase: new URL('https://sendasenior.com.br'),
  alternates: { canonical: '/' },
  icons: {
    icon: '/brand/senda-favicon.png',
    shortcut: '/brand/senda-favicon.png',
    apple: '/apple-icon',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Senda Sênior — Planejamento & Assessoria Sênior',
    description:
      'Uma jornada de cuidado e independência. Organize cenários, documentos e diálogos respeitando a autonomia de quem você ama.',
    siteName: 'Senda Sênior',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Senda Sênior — Planejamento & Assessoria Sênior',
    description: 'Guia prático para organização familiar e cuidado sênior preventivo.',
  },
}

/**
 * JSON-LD de Organização — ajuda o Google/AI a entender QUE entidade é a "Senda Sênior"
 * (desambiguação: existem outras empresas com nome parecido). Não é executável, então não
 * conflita com a CSP. Atualize `sameAs` quando houver perfis sociais oficiais.
 */
const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Senda Sênior',
  legalName: 'Senda Sênior',
  slogan: 'Planejamento & Assessoria Sênior',
  url: 'https://sendasenior.com.br',
  logo: 'https://sendasenior.com.br/brand/logo-wordmark-dark.png',
  image: 'https://sendasenior.com.br/brand/logo-wordmark-dark.png',
  description:
    'Plataforma de planejamento e assessoria para o envelhecimento familiar. Manuais e consultoria para famílias organizarem o cuidado de pais idosos antes da urgência.',
  email: 'contato@sendasenior.com.br',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  knowsLanguage: 'pt-BR',
  founder: [
    { '@type': 'Person', name: 'Julianne Pimentel' },
    { '@type': 'Person', name: 'Luciana Moura' },
  ],
}

// Definicão das fontes
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--sans',
  display: 'swap',
})

// Layout principal da aplicação
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${dmSans.variable}`}>
      {/*
        `suppressHydrationWarning` no body: extensões do navegador (ColorZilla,
        Grammarly, LastPass, etc) injetam atributos tipo `cz-shortcut-listen`
        antes do React hidratar. Esse warning não reflete bug nosso.
      */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <BfCacheGuard />
        <a href="#main-content" className="sr-only">
          Pular para conteúdo principal
        </a>
        <WhatsAppFloat />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}
