'use client'

/**
 * DashboardView.tsx
 * Painel do cliente — resumo do processo, pendências e atalhos para documentos/assessoria.
 *
 * Conecta: mockStore (preview) | Checklist (legado) | AppShell
 * Camada: browser (use client)
 */

import Link from 'next/link'
import NextImage from 'next/image'
import { useMemo } from 'react'
import {
  FolderOpen,
  ClipboardList,
  Handshake,
  FileUp,
  MessageSquare,
  Settings,
  Shield,
} from 'lucide-react'
import { ErrorBoundary } from '@/design'
import { Checklist } from './Checklist'
import {
  ASSESSORAS,
  ETAPAS,
  countPendencias,
  statusLabel,
} from '@/features/assessoria/mock'
import { PREVIEW_CLIENTE_ID } from '@/features/assessoria/mockStore'
import { useMockSolicitacoes } from '@/features/assessoria/useMockSolicitacoes'
import type { ChecklistItem } from '@/features/dashboard/types'

const ACOES = [
  {
    icon: ClipboardList,
    title: 'Ver pendências',
    desc: 'O que ainda falta enviar.',
    href: '/solicitacoes',
    color: 'text-[var(--color-terracotta)]',
    bg: 'bg-[var(--color-terracotta-pale)]',
  },
  {
    icon: FileUp,
    title: 'Enviar documento',
    desc: 'Responder a uma solicitação.',
    href: '/solicitacoes',
    color: 'text-[var(--color-green)]',
    bg: 'bg-[var(--color-green-muted)]',
  },
  {
    icon: MessageSquare,
    title: 'Falar com a assessoria',
    desc: 'Abrir o acompanhamento.',
    href: '/assessoria',
    color: 'text-[var(--color-green)]',
    bg: 'bg-[var(--color-green-muted)]',
  },
  {
    icon: Settings,
    title: 'Configurações',
    desc: 'Perfil, foto e segurança.',
    href: '/configuracoes',
    color: 'text-[var(--color-ink-sub)]',
    bg: 'bg-[var(--color-sage-pale)]',
  },
]

interface DashboardViewProps {
  firstName: string
  ownerUserId: string
  initialChecklist: ChecklistItem[]
}

export function DashboardView({ firstName, ownerUserId, initialChecklist }: DashboardViewProps) {
  const { itens } = useMockSolicitacoes(ownerUserId, PREVIEW_CLIENTE_ID)
  const pendenciasCount = countPendencias(itens)
  const pendencias = itens
    .filter((s) => s.status === 'pendente' || s.status === 'precisa_atualizacao')
    .slice(0, 3)
  const enviados = itens.filter((s) => s.status !== 'pendente').length

  const pilares = useMemo(
    () => [
      {
        icon: FolderOpen,
        eyebrow: 'Seu arquivo',
        title: 'Documentos',
        desc: 'Arquivos enviados e armazenados com segurança. Você continua dono de cada um.',
        href: '/vault',
        meta: `${enviados} enviados · ${pendenciasCount} aguardando`,
        cta: 'Abrir documentos',
      },
      {
        icon: ClipboardList,
        eyebrow: 'Prioridade',
        title: 'Pendências',
        desc: 'Tudo que sua assessora solicitou para avançar nesta etapa.',
        href: '/solicitacoes',
        meta: pendencias.map((p) => p.titulo).join(' · ') || 'Nenhuma pendência',
        cta: 'Enviar documentos',
      },
      {
        icon: Handshake,
        eyebrow: 'Acompanhamento',
        title: 'Sua Assessoria',
        desc: 'Solicitações e conversa com quem cuida do seu processo.',
        href: '/assessoria',
        meta: ASSESSORAS.map((a) => a.nome.split(' ')[0]).join(' · '),
        cta: 'Abrir acompanhamento',
      },
    ],
    [enviados, pendencias, pendenciasCount],
  )

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="relative mb-6 overflow-hidden rounded-[20px] bg-[var(--color-olive)] px-8 py-9 text-[var(--color-cream)] lg:px-10">
        {/* Marca atrás do saludo — não sob o card "Etapa atual" */}
        <div
          className="pointer-events-none absolute -bottom-10 -left-8 h-[200px] w-[200px] opacity-[0.08] lg:h-[240px] lg:w-[240px]"
          aria-hidden
        >
          <NextImage
            src="/brand/logo-white-only.webp"
            alt=""
            fill
            className="object-contain object-left-bottom"
            sizes="240px"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[520px]">
            <p className="mb-4 font-sans text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-cream-60)]">
              Seu processo
            </p>
            <h1 className="mb-3 font-serif text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em]">
              Olá, {firstName}.
            </h1>
            <p className="mb-7 max-w-[420px] font-sans text-[14.5px] leading-[1.65] text-[var(--color-cream-75)]">
              Sua assessoria está acompanhando seu processo.
              {pendenciasCount > 0 ? (
                <>
                  {' '}
                  Ainda faltam{' '}
                  <span className="font-semibold text-[var(--color-cream)]">
                    {pendenciasCount} documento{pendenciasCount === 1 ? '' : 's'}
                  </span>{' '}
                  para concluir esta etapa.
                </>
              ) : (
                <> Tudo em dia por enquanto.</>
              )}
            </p>
            <Link
              href="/solicitacoes"
              className="inline-flex items-center gap-1.5 font-sans text-[13.5px] font-semibold text-[var(--color-cream-80)] no-underline transition-colors hover:text-[var(--color-cream)]"
            >
              Ver pendências <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="relative z-10 w-full max-w-[260px] rounded-[14px] border border-[rgba(233,226,210,0.18)] bg-[rgba(28,34,20,0.42)] px-5 py-4 backdrop-blur-[6px]">
            <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-cream-60)]">
              Etapa atual
            </p>
            <ul className="space-y-2.5">
              {ETAPAS.map((etapa) => (
                <li key={etapa.id} className="flex items-center gap-2.5">
                  <span
                    className={[
                      'inline-block h-2 w-2 flex-shrink-0 rounded-full',
                      etapa.done
                        ? 'bg-[var(--color-cream)]'
                        : etapa.current
                          ? 'bg-[var(--color-cream-80)] ring-2 ring-[rgba(233,226,210,0.35)]'
                          : 'border border-[var(--color-cream-55)] bg-transparent',
                    ].join(' ')}
                    aria-hidden
                  />
                  <span
                    className={[
                      'font-sans text-[13px] leading-tight',
                      etapa.done || etapa.current
                        ? 'font-medium text-[var(--color-cream)]'
                        : 'text-[var(--color-cream-60)]',
                    ].join(' ')}
                  >
                    {etapa.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {pilares.map((p) => {
          const Icon = p.icon
          return (
            <Link
              key={p.href + p.title}
              href={p.href}
              className="group block rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 no-underline shadow-[0_2px_12px_rgba(42,37,32,0.05)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(42,37,32,0.1)]"
            >
              <div className="mb-5 text-[var(--color-ink)] opacity-55">
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
                {p.eyebrow}
              </p>
              <h3 className="mb-2 font-serif text-[18.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--color-ink)]">
                {p.title}
              </h3>
              <p className="mb-3 font-sans text-[13px] leading-[1.6] text-[var(--color-ink-sub)]">
                {p.desc}
              </p>
              <p className="mb-5 font-sans text-[12.5px] leading-[1.5] text-[var(--color-ink-muted)]">
                {p.meta}
              </p>
              <span className="font-sans text-[13px] font-semibold text-[var(--color-terracotta)]">
                {p.cta} →
              </span>
            </Link>
          )
        })}
      </div>

      <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
        Ações rápidas
      </p>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ACOES.map((a) => {
          const Icon = a.icon
          return (
            <Link
              key={a.title}
              href={a.href}
              className="group block rounded-[14px] border border-[rgba(42,37,32,0.06)] bg-[var(--color-warm-cream)] p-4 no-underline transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_4px_20px_rgba(42,37,32,0.08)]"
            >
              <div className={`mb-3 inline-flex rounded-[8px] p-2 ${a.bg} ${a.color}`}>
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <p className="font-sans text-[13.5px] font-semibold text-[var(--color-ink)]">
                {a.title}
              </p>
              <p className="mt-0.5 font-sans text-[11.5px] leading-[1.5] text-[var(--color-ink-muted)]">
                {a.desc}
              </p>
            </Link>
          )
        })}
      </div>

      <div id="checklist" className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[var(--color-green-muted)] text-[var(--color-green)]">
                <ClipboardList size={18} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-[17px] font-semibold text-[var(--color-ink)]">
                Solicitações recentes
              </h3>
            </div>
            <Link
              href="/solicitacoes"
              className="font-sans text-[12.5px] font-semibold text-[var(--color-terracotta)] no-underline hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {itens.slice(0, 4).map((item) => {
              const done =
                item.status === 'aprovado' || item.status === 'enviado' || item.status === 'em_revisao'
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-[10px] bg-[rgba(45,95,79,0.04)] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[13.5px] font-medium text-[var(--color-ink-sub)]">
                      {item.titulo}
                    </p>
                    <p className="truncate font-sans text-[11.5px] text-[var(--color-ink-muted)]">
                      {item.solicitadoPor}
                    </p>
                  </div>
                  <span
                    className={[
                      'flex-shrink-0 font-sans text-[12.5px] font-semibold',
                      done ? 'text-[var(--color-green)]' : 'text-[var(--color-terracotta)]',
                    ].join(' ')}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[var(--color-green-muted)] text-[var(--color-green)]">
                <Shield size={18} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-[17px] font-semibold text-[var(--color-ink)]">
                Controle de acesso
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {ASSESSORAS.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-[10px] bg-[rgba(45,95,79,0.04)] px-3 py-2.5"
                >
                  <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-green-muted)]">
                    <NextImage src={a.foto} alt="" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[13.5px] font-semibold text-[var(--color-ink)]">
                      {a.nome}
                    </p>
                    <p className="font-sans text-[11.5px] text-[var(--color-ink-muted)]">
                      {a.papel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ErrorBoundary>
            <Checklist initialItems={initialChecklist} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
