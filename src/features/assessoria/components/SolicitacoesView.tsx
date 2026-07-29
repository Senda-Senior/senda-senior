/**
 * SolicitacoesView.tsx
 * Lista de solicitações da assessoria — coração do fluxo cliente → envio.
 *
 * Conecta: mockStore (preview) | AppShell
 * Camada: browser (use client)
 */

'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { ClipboardList } from 'lucide-react'
import { statusLabel, type Solicitacao } from '@/features/assessoria/mock'
import { MOCK_UPLOAD_MAX_BYTES, readFileAsDataUrl } from '@/features/assessoria/download'
import { PREVIEW_CLIENTE_ID } from '@/features/assessoria/mockStore'
import { useMockSolicitacoes } from '@/features/assessoria/useMockSolicitacoes'

function isOpen(status: Solicitacao['status']) {
  return status === 'pendente' || status === 'precisa_atualizacao'
}

export function SolicitacoesView({ ownerUserId }: { ownerUserId: string }) {
  const { itens, enviarArquivo } = useMockSolicitacoes(ownerUserId, PREVIEW_CLIENTE_ID)
  const abertas = itens.filter((s) => isOpen(s.status))
  const demais = itens.filter((s) => !isOpen(s.status))

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-8 max-w-[720px]">
        <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
          Processo
        </p>
        <h1 className="mb-3 font-serif text-[clamp(26px,3.2vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
          Solicitações
        </h1>
        <p className="max-w-[540px] font-sans text-[15px] leading-[1.65] text-[var(--color-ink-sub)]">
          Envie apenas o que foi pedido. Cada arquivo fica liberado só para a assessoria do seu processo.
        </p>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList size={16} strokeWidth={1.8} className="text-[var(--color-terracotta)]" />
          <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
            Aguardando envio · {abertas.length}
          </p>
        </div>
        <div className="space-y-3">
          {abertas.length === 0 ? (
            <p className="rounded-[14px] border border-dashed border-[rgba(42,37,32,0.12)] px-5 py-6 font-sans text-[14px] text-[var(--color-ink-muted)]">
              Nenhuma pendência no momento.
            </p>
          ) : (
            abertas.map((item) => (
              <SolicitacaoCard key={item.id} item={item} onEnviar={enviarArquivo} />
            ))
          )}
        </div>
      </section>

      <section>
        <p className="mb-4 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
          Já enviados
        </p>
        <div className="space-y-3">
          {demais.length === 0 ? (
            <p className="font-sans text-[13px] text-[var(--color-ink-muted)]">
              Ainda não há envios nesta etapa.
            </p>
          ) : (
            demais.map((item) => (
              <SolicitacaoCard key={item.id} item={item} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function SolicitacaoCard({
  item,
  onEnviar,
}: {
  item: Solicitacao
  onEnviar?: (id: string, arquivoNome: string, arquivoDataUrl?: string | null) => void
}) {
  const open = isOpen(item.status)
  const inputRef = useRef<HTMLInputElement>(null)
  const [enviando, setEnviando] = useState(false)

  function handlePick() {
    inputRef.current?.click()
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !onEnviar) return
    setEnviando(true)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      onEnviar(item.id, file.name, dataUrl)
      if (!dataUrl && file.size > MOCK_UPLOAD_MAX_BYTES) {
        // Arquivo grande: status atualiza sem preview baixável do binário original.
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <article className="rounded-[16px] border border-[rgba(42,37,32,0.07)] bg-white p-5 shadow-[0_2px_12px_rgba(42,37,32,0.04)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={[
                'inline-flex h-5 w-5 items-center justify-center rounded-[6px] font-sans text-[12px] font-bold',
                open
                  ? 'bg-[var(--color-terracotta-pale)] text-[var(--color-terracotta)]'
                  : 'bg-[var(--color-green-muted)] text-[var(--color-green)]',
              ].join(' ')}
              aria-hidden
            >
              {open ? '○' : '✓'}
            </span>
            <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
              {item.titulo}
            </h2>
          </div>
          <p className="font-sans text-[13px] text-[var(--color-ink-sub)]">
            Solicitado por {item.solicitadoPor}
            {item.prazo ? ` · Prazo ${item.prazo}` : ''}
          </p>
          {item.comentario && (
            <p className="mt-3 rounded-[10px] bg-[rgba(45,95,79,0.04)] px-4 py-3 font-sans text-[13px] leading-[1.55] text-[var(--color-ink-sub)]">
              “{item.comentario}”
            </p>
          )}
          {item.arquivo && (
            <p className="mt-2 font-sans text-[12.5px] text-[var(--color-ink-muted)]">
              Arquivo: {item.arquivo}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <span
            className={[
              'font-sans text-[12.5px] font-semibold',
              open ? 'text-[var(--color-terracotta)]' : 'text-[var(--color-green)]',
            ].join(' ')}
          >
            {statusLabel(item.status)}
          </span>
          {open && onEnviar ? (
            <>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp,application/pdf"
                className="sr-only"
                onChange={handleFile}
              />
              <button
                type="button"
                onClick={handlePick}
                disabled={enviando}
                className="inline-flex items-center justify-center rounded-[10px] bg-[var(--color-green)] px-4 py-2.5 font-sans text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {enviando ? 'Enviando…' : 'Enviar arquivo'}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  )
}
