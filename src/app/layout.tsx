import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import { WhatsAppFloat } from '@/features/landing'
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
        <WhatsAppFloat />
        {children}
      </body>
    </html>
  )
}
