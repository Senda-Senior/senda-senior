'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { FileText, Heart, Users, FolderOpen, ClipboardList, UserPlus, Settings, Shield } from 'lucide-react'
import { ErrorBoundary } from '@/design'
import { Checklist } from './Checklist'
import type { ChecklistItem } from '@/features/dashboard/types'

const PILARES = [
  {
    icon: <FileText size={26} strokeWidth={1.5} />,
    eyebrow: 'Arquivo Seguro',
    title: 'Documentos e Procurações',
    desc: 'Testamentos, diretrizes antecipadas e procurações organizadas e seguras.',
    href: '/vault/juridico',
  },
  {
    icon: <Heart size={26} strokeWidth={1.5} fill="currentColor" />,
    eyebrow: 'Histórico Médico',
    title: 'Histórico Médico',
    desc: 'Medicamentos, médicos e informações de saúde — para você e a quem você ama.',
    href: '/vault/saude',
  },
  {
    icon: <Users size={26} strokeWidth={1.5} />,
    eyebrow: 'Rede de Apoio',
    title: 'Rede de Confiança',
    desc: 'Família, cuidadores e profissionais — com acesso controlado por você.',
    href: '/rede-de-confianca',
  },
]

const ACOES = [
  {
    icon: <FolderOpen size={20} strokeWidth={1.6} />,
    title: 'Abrir cofre',
    desc: 'Seus documentos organizados automaticamente.',
    href: '/vault',
    color: 'text-[var(--color-green)]',
    bg: 'bg-[var(--color-green-muted)]',
  },
  {
    icon: <ClipboardList size={20} strokeWidth={1.6} />,
    title: 'Ver checklist',
    desc: 'Acompanhe tarefas e cuidados preventivos.',
    href: '#checklist',
    color: 'text-[var(--color-terracotta)]',
    bg: 'bg-[var(--color-terracotta-pale)]',
  },
  {
    icon: <UserPlus size={20} strokeWidth={1.6} />,
    title: 'Convidar pessoa',
    desc: 'Adicionar à rede de confiança.',
    href: '/rede-de-confianca',
    color: 'text-[var(--color-green)]',
    bg: 'bg-[var(--color-green-muted)]',
  },
  {
    icon: <Settings size={20} strokeWidth={1.6} />,
    title: 'Configurar acessos',
    desc: 'Gerenciar permissões.',
    href: '/em-construcao',
    color: 'text-[var(--color-ink-sub)]',
    bg: 'bg-[var(--color-sage-pale)]',
  },
]

interface DashboardViewProps {
  firstName: string
  initialChecklist: ChecklistItem[]
}

export function DashboardView({ firstName, initialChecklist }: DashboardViewProps) {
  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-[20px] bg-[var(--color-olive)] px-8 py-9 text-[var(--color-cream)] lg:px-10">
        {/* Decorative brand mark */}
        <div className="pointer-events-none absolute right-0 top-1/2 h-[260px] w-[260px] -translate-y-1/2 opacity-[0.07]">
          <NextImage
            src="/brand/logo-white-only-hd-nobg.png"
            alt=""
            fill
            className="object-contain object-center"
          />
        </div>

        <div className="relative z-10 max-w-[500px]">
          <p className="mb-4 font-sans text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-cream-60)]">
            Painel
          </p>
          <h1 className="mb-3 font-serif text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            Olá, {firstName}.
          </h1>
          <p className="mb-7 max-w-[380px] font-sans text-[14.5px] leading-[1.65] text-[var(--color-cream-75)]">
            Continue organizando o que importa. Tudo sob seu controle.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-sans text-[13.5px] font-semibold text-[var(--color-cream-80)] no-underline transition-colors hover:text-[var(--color-cream)]"
          >
            Ir para o site <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PILARES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            prefetch={false}
            className="group block rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 no-underline shadow-[0_2px_12px_rgba(42,37,32,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(42,37,32,0.1)]"
          >
            <div className="mb-5 text-[var(--color-ink)] opacity-55">
              {p.icon}
            </div>
            <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
              {p.eyebrow}
            </p>
            <h3 className="mb-2 font-serif text-[18.5px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--color-ink)]">
              {p.title}
            </h3>
            <p className="mb-5 font-sans text-[13px] leading-[1.6] text-[var(--color-ink-sub)]">
              {p.desc}
            </p>
            <span className="font-sans text-[13px] font-semibold text-[var(--color-terracotta)]">
              Acessar →
            </span>
          </Link>
        ))}
      </div>

      {/* Ações rápidas */}
      <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
        Ações rápidas
      </p>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ACOES.map((a) => (
          <Link
            key={a.title}
            href={a.href}
            prefetch={false}
            className="group block rounded-[14px] border border-[rgba(42,37,32,0.06)] bg-[var(--color-warm-cream)] p-4 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_4px_20px_rgba(42,37,32,0.08)]"
          >
            <div className={`mb-3 inline-flex rounded-[8px] p-2 ${a.bg} ${a.color}`}>
              {a.icon}
            </div>
            <p className="font-sans text-[13.5px] font-semibold text-[var(--color-ink)]">
              {a.title}
            </p>
            <p className="mt-0.5 font-sans text-[11.5px] leading-[1.5] text-[var(--color-ink-muted)]">
              {a.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Status row */}
      <div id="checklist" className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Segurança */}
        <div className="rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[var(--color-green-muted)] text-[var(--color-green)]">
              <Shield size={18} strokeWidth={1.8} />
            </div>
            <h3 className="font-serif text-[17px] font-semibold text-[var(--color-ink)]">
              Segurança
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Criptografia', status: 'Ativa' },
              { label: 'Autenticação', status: 'Verificada' },
              { label: 'LGPD', status: 'Em conformidade' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[10px] bg-[rgba(45,95,79,0.04)] px-4 py-3"
              >
                <span className="font-sans text-[13.5px] font-medium text-[var(--color-ink-sub)]">
                  {item.label}
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[13px] font-semibold text-[var(--color-green)]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ErrorBoundary>
          <Checklist initialItems={initialChecklist} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
