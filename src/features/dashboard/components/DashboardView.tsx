'use client'

/**
 * DashboardView.tsx
 * Painel do cliente — atalhos reais, sem inventar solicitações nem acesso de assessoras.
 *
 * Conecta: Checklist | AppShell
 * Camada: browser (use client)
 */

import Link from 'next/link'
import { FolderOpen, ClipboardList, Handshake } from 'lucide-react'
import { ErrorBoundary } from '@/design'
import { Checklist } from './Checklist'
import type { ChecklistItem } from '@/features/dashboard/types'

const PILARES = [
  {
    icon: FolderOpen,
    title: 'Documentos',
    desc: 'Seu cofre — arquivos sob seu controle.',
    href: '/vault',
    cta: 'Abrir documentos',
  },
  {
    icon: ClipboardList,
    title: 'Solicitações',
    desc: 'O que a assessoria pedir, quando pedir.',
    href: '/solicitacoes',
    cta: 'Ver solicitações',
  },
  {
    icon: Handshake,
    title: 'Assessoria',
    desc: 'Acompanhamento do seu processo.',
    href: '/assessoria',
    cta: 'Abrir assessoria',
  },
] as const

interface DashboardViewProps {
  firstName: string
  /** Mantido na assinatura por compatibilidade com a page. */
  ownerUserId?: string
  initialChecklist: ChecklistItem[]
}

export function DashboardView({ firstName, initialChecklist }: DashboardViewProps) {
  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="relative mb-8 overflow-hidden rounded-[20px] bg-[var(--color-olive)] px-8 py-9 text-[var(--color-cream)] lg:px-10">
        <div className="relative z-10 max-w-[520px]">
          <p className="mb-4 font-sans text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-cream-60)]">
            Seu espaço
          </p>
          <h1 className="mb-3 font-serif text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            Olá, {firstName}.
          </h1>
          <p className="max-w-[420px] font-sans text-[14.5px] leading-[1.65] text-[var(--color-cream-75)]">
            Organize documentos e acompanhe o que for solicitado. Nada aparece aqui sem um pedido real.
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PILARES.map((p) => {
          const Icon = p.icon
          return (
            <Link
              key={p.href}
              href={p.href}
              className="group block rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 no-underline shadow-[0_2px_12px_rgba(42,37,32,0.05)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(42,37,32,0.1)]"
            >
              <div className="mb-5 text-[var(--color-ink)] opacity-55">
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-serif text-[18.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--color-ink)]">
                {p.title}
              </h3>
              <p className="mb-5 font-sans text-[13px] leading-[1.6] text-[var(--color-ink-sub)]">
                {p.desc}
              </p>
              <span className="font-sans text-[13px] font-semibold text-[var(--color-terracotta)]">
                {p.cta} →
              </span>
            </Link>
          )
        })}
      </div>

      <ErrorBoundary>
        <Checklist initialItems={initialChecklist} />
      </ErrorBoundary>
    </div>
  )
}
