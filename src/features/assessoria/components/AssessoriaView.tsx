/**
 * AssessoriaView.tsx
 * Acompanhamento do processo — sem inventar vínculo nem documentos liberados.
 *
 * Conecta: useMockSolicitacoes | AppShell
 * Camada: browser (use client)
 */

'use client'

import Link from 'next/link'
import { PREVIEW_CLIENTE_ID } from '@/features/assessoria/mockStore'
import { useMockSolicitacoes } from '@/features/assessoria/useMockSolicitacoes'
import { statusLabel } from '@/features/assessoria/mock'

export function AssessoriaView({
  showEquipeLink = false,
  ownerUserId,
}: {
  showEquipeLink?: boolean
  ownerUserId: string
}) {
  const { itens } = useMockSolicitacoes(ownerUserId, PREVIEW_CLIENTE_ID)
  const liberados = itens.filter((s) => s.status !== 'pendente')

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
          Quando houver assessoria vinculada ao seu processo, o acompanhamento aparece aqui.
          Documentos só entram depois de um pedido real.
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

        {liberados.length === 0 ? (
          <p className="rounded-[12px] border border-dashed border-[rgba(42,37,32,0.12)] px-5 py-6 font-sans text-[14px] text-[var(--color-ink-muted)]">
            Ainda não há documentos liberados.
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(42,37,32,0.06)]">
            {liberados.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-sans text-[14px] font-medium text-[var(--color-ink)]">
                    {item.titulo}
                  </p>
                  <p className="truncate font-sans text-[12px] text-[var(--color-ink-muted)]">
                    {item.arquivo ? item.arquivo : 'Sem arquivo'}
                  </p>
                </div>
                <span className="flex-shrink-0 font-sans text-[12.5px] font-semibold text-[var(--color-green)]">
                  {statusLabel(item.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
