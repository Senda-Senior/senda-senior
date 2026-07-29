/**
 * EquipePainelView.tsx
 * Preview mock — visão das assessoras: lista de clientes e vínculo.
 *
 * Conecta: mock assessoria | AppShell
 * Camada: browser (use client)
 */

'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { useEffect, useState } from 'react'
import {
  ASSESSORAS,
  CLIENTES,
  clienteStatusLabel,
  countPendencias,
} from '@/features/assessoria/mock'
import { getMockSolicitacoes, subscribeMockStore } from '@/features/assessoria/mockStore'

export function EquipePainelView({ ownerUserId }: { ownerUserId: string }) {
  const [assessoraId, setAssessoraId] = useState(ASSESSORAS[0].id)
  const [hydrated, setHydrated] = useState(false)
  const [tick, setTick] = useState(0)
  const assessora = ASSESSORAS.find((a) => a.id === assessoraId) ?? ASSESSORAS[0]
  const ativos = CLIENTES.filter((c) => c.status !== 'aguardando_vinculo')
  const pendentes = CLIENTES.filter((c) => c.status === 'aguardando_vinculo')

  useEffect(() => {
    setHydrated(true)
    return subscribeMockStore(() => setTick((n) => n + 1))
  }, [])
  void tick

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[560px]">
          <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
            Assessoria
          </p>
          <h1 className="mb-2 font-serif text-[clamp(26px,3.2vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
            Seus clientes
          </h1>
          <p className="font-sans text-[15px] leading-[1.65] text-[var(--color-ink-sub)]">
            Entre no processo do cliente — só o que foi solicitado e liberado.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ASSESSORAS.map((a) => {
            const active = a.id === assessora.id
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAssessoraId(a.id)}
                className={[
                  'flex items-center gap-2.5 rounded-[12px] border px-3 py-2 transition-colors',
                  active
                    ? 'border-[var(--color-green)] bg-white shadow-[0_2px_12px_rgba(42,37,32,0.06)]'
                    : 'border-[rgba(42,37,32,0.08)] bg-[rgba(42,37,32,0.03)] hover:bg-white',
                ].join(' ')}
              >
                <span className="relative h-8 w-8 overflow-hidden rounded-full bg-[var(--color-green-muted)]">
                  <NextImage src={a.foto} alt="" fill className="object-cover" sizes="32px" />
                </span>
                <span className="font-sans text-[13px] font-semibold text-[var(--color-ink)]">
                  {a.nome.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
        Em acompanhamento · {ativos.length}
      </p>
      <div className="mb-8 space-y-3">
        {ativos.map((cliente) => {
          const pendencias = countPendencias(
            hydrated
              ? getMockSolicitacoes(ownerUserId, cliente.id)
              : cliente.solicitacoes,
          )
          return (
            <Link
              key={cliente.id}
              href={`/equipe/${cliente.id}?como=${assessora.id}`}
              className="flex flex-col gap-3 rounded-[16px] border border-[rgba(42,37,32,0.07)] bg-white p-5 no-underline shadow-[0_2px_12px_rgba(42,37,32,0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(42,37,32,0.1)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-[19px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
                    {cliente.nome}
                  </h2>
                  <span className="rounded-[6px] bg-[var(--color-green-muted)] px-2 py-0.5 font-sans text-[11px] font-semibold text-[var(--color-green)]">
                    {clienteStatusLabel(cliente.status)}
                  </span>
                </div>
                <p className="font-sans text-[13px] text-[var(--color-ink-sub)]">
                  {cliente.etapa} · {cliente.ultimaAtualizacao}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-4">
                <p className="font-sans text-[13px] text-[var(--color-ink-muted)]">
                  {pendencias > 0
                    ? `${pendencias} pendência${pendencias === 1 ? '' : 's'}`
                    : 'Sem pendências'}
                </p>
                <span className="font-sans text-[13px] font-semibold text-[var(--color-terracotta)]">
                  Abrir →
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {pendentes.length > 0 && (
        <section>
          <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
            Aguardando aceite · {pendentes.length}
          </p>
          <div className="space-y-3">
            {pendentes.map((cliente) => (
              <div
                key={cliente.id}
                className="rounded-[16px] border border-dashed border-[rgba(42,37,32,0.14)] bg-[rgba(42,37,32,0.02)] px-5 py-4 sm:px-6"
              >
                <p className="font-serif text-[17px] font-semibold text-[var(--color-ink)]">
                  {cliente.nome}
                </p>
                <p className="mt-1 font-sans text-[13px] text-[var(--color-ink-muted)]">
                  Convite enviado · ainda não entrou na lista ativa
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
