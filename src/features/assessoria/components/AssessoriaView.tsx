/**
 * AssessoriaView.tsx
 * Acompanhamento do processo com as assessoras — vínculo e visão do que foi liberado.
 *
 * Conecta: mock assessoria | AppShell
 * Camada: browser (use client)
 */

'use client'

import NextImage from 'next/image'
import Link from 'next/link'
import { ASSESSORAS, SOLICITACOES, statusLabel } from '@/features/assessoria/mock'

export function AssessoriaView({ showEquipeLink = false }: { showEquipeLink?: boolean }) {
  const liberados = SOLICITACOES.filter((s) => s.status !== 'pendente')

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-8 max-w-[720px]">
        <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
          Acompanhamento
        </p>
        <h1 className="mb-3 font-serif text-[clamp(26px,3.2vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
          Sua Assessoria
        </h1>
        <p className="max-w-[540px] font-sans text-[15px] leading-[1.65] text-[var(--color-ink-sub)]">
          Luciana e Julianne trabalham no seu processo. Elas veem só o que você liberou a partir das solicitações.
        </p>
        {showEquipeLink && (
          <Link
            href="/equipe"
            className="mt-4 inline-flex font-sans text-[13px] font-semibold text-[var(--color-terracotta)] no-underline hover:underline"
          >
            Abrir visão assessora →
          </Link>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ASSESSORAS.map((a) => (
          <article
            key={a.id}
            className="flex items-center gap-4 rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-5 shadow-[0_2px_12px_rgba(42,37,32,0.04)]"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-green-muted)]">
              <NextImage src={a.foto} alt="" fill className="object-cover" sizes="64px" />
            </div>
            <div className="min-w-0">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)]">
                {a.papel}
              </p>
              <h2 className="font-serif text-[20px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
                {a.nome}
              </h2>
              <p className="mt-1 font-sans text-[12.5px] text-[var(--color-ink-muted)]">
                Última atualização: hoje
              </p>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
              Liberado para análise
            </p>
            <h3 className="font-serif text-[18px] font-semibold text-[var(--color-ink)]">
              Documentos do processo
            </h3>
          </div>
          <Link
            href="/solicitacoes"
            className="font-sans text-[13px] font-semibold text-[var(--color-terracotta)] no-underline hover:underline"
          >
            Ver solicitações →
          </Link>
        </div>

        <ul className="divide-y divide-[rgba(42,37,32,0.06)]">
          {liberados.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate font-sans text-[14px] font-medium text-[var(--color-ink)]">
                  {item.titulo}
                </p>
                <p className="truncate font-sans text-[12px] text-[var(--color-ink-muted)]">
                  Com {item.solicitadoPor}
                  {item.arquivo ? ` · ${item.arquivo}` : ''}
                </p>
              </div>
              <span className="flex-shrink-0 font-sans text-[12.5px] font-semibold text-[var(--color-green)]">
                {statusLabel(item.status)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
