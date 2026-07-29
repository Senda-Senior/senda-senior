/**
 * EquipeClienteView.tsx
 * Preview — processo de um cliente na visão da assessora.
 *
 * Conecta: mockStore | download helper | AppShell
 * Camada: browser (use client)
 */

'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { useMemo, useState, type ReactNode } from 'react'
import {
  ASSESSORAS,
  clienteStatusLabel,
  statusLabel,
  type ClienteMock,
  type Solicitacao,
} from '@/features/assessoria/mock'
import { downloadSolicitacaoArquivo } from '@/features/assessoria/download'
import { useMockSolicitacoes } from '@/features/assessoria/useMockSolicitacoes'

interface Props {
  cliente: ClienteMock
  assessoraId: string
  ownerUserId: string
}

export function EquipeClienteView({ cliente, assessoraId, ownerUserId }: Props) {
  const assessora = ASSESSORAS.find((a) => a.id === assessoraId) ?? ASSESSORAS[0]
  const { itens, adicionar, setStatus, atualizar } = useMockSolicitacoes(ownerUserId, cliente.id)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoComentario, setNovoComentario] = useState('')
  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [revisaoId, setRevisaoId] = useState<string | null>(null)
  const [revisaoMsg, setRevisaoMsg] = useState('')

  const pendencias = useMemo(
    () => itens.filter((s) => s.status === 'pendente' || s.status === 'precisa_atualizacao').length,
    [itens],
  )

  const itemRevisao = revisaoId ? itens.find((s) => s.id === revisaoId) : null

  function solicitar() {
    const titulo = novoTitulo.trim()
    if (!titulo) return
    const nova: Solicitacao = {
      id: `local-${Date.now()}`,
      titulo,
      solicitadoPor: assessora.nome,
      prazo: null,
      comentario: novoComentario.trim() || null,
      status: 'pendente',
      arquivo: null,
    }
    adicionar(nova)
    setNovoTitulo('')
    setNovoComentario('')
    setMostrandoForm(false)
  }

  function confirmarRevisao() {
    if (!revisaoId) return
    const msg = revisaoMsg.trim()
    atualizar(revisaoId, {
      status: 'precisa_atualizacao',
      comentario: msg || 'Precisamos de uma versão atualizada deste documento.',
      arquivo: null,
      arquivoDataUrl: null,
    })
    setRevisaoId(null)
    setRevisaoMsg('')
  }

  function abrirRevisao(id: string) {
    setRevisaoId(id)
    setRevisaoMsg('')
  }

  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <Link
        href={`/equipe?como=${assessora.id}`}
        className="mb-5 inline-flex font-sans text-[13px] font-semibold text-[var(--color-terracotta)] no-underline hover:underline"
      >
        ← Voltar aos clientes
      </Link>

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
            Cliente
          </p>
          <h1 className="mb-2 font-serif text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
            {cliente.nome}
          </h1>
          <p className="font-sans text-[14px] text-[var(--color-ink-sub)]">
            {clienteStatusLabel(cliente.status)} · {cliente.etapa}
            {pendencias > 0 ? ` · ${pendencias} pendência${pendencias === 1 ? '' : 's'}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-[14px] border border-[rgba(42,37,32,0.07)] bg-white px-4 py-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[var(--color-green-muted)]">
            <NextImage src={assessora.foto} alt="" fill className="object-cover" sizes="40px" />
          </span>
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Você
            </p>
            <p className="font-sans text-[14px] font-semibold text-[var(--color-ink)]">
              {assessora.nome}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setMostrandoForm((v) => !v)}
          className="rounded-[10px] bg-[var(--color-green)] px-4 py-2.5 font-sans text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          + Solicitar documento
        </button>
      </div>

      {mostrandoForm && (
        <div className="mb-6 space-y-3 rounded-[16px] border border-[rgba(42,37,32,0.07)] bg-white p-5 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
          <p className="font-serif text-[17px] font-semibold text-[var(--color-ink)]">
            Nova solicitação
          </p>
          <label className="block">
            <span className="mb-1.5 block font-sans text-[12px] font-semibold text-[var(--color-ink-sub)]">
              Documento
            </span>
            <input
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              placeholder="Ex.: Certidão de nascimento"
              className="w-full rounded-[10px] border border-[rgba(42,37,32,0.12)] bg-[var(--color-cream)] px-3.5 py-2.5 font-sans text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-green)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-sans text-[12px] font-semibold text-[var(--color-ink-sub)]">
              Comentário (opcional)
            </span>
            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              rows={2}
              placeholder="Orientação para o cliente"
              className="w-full resize-y rounded-[10px] border border-[rgba(42,37,32,0.12)] bg-[var(--color-cream)] px-3.5 py-2.5 font-sans text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-green)]"
            />
          </label>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setMostrandoForm(false)}>Cancelar</GhostBtn>
            <PrimaryBtn onClick={solicitar}>Solicitar</PrimaryBtn>
          </div>
        </div>
      )}

      {itemRevisao && (
        <div className="mb-6 space-y-3 rounded-[16px] border border-[rgba(180,120,60,0.28)] bg-white p-5 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
          <p className="font-serif text-[17px] font-semibold text-[var(--color-ink)]">
            Pedir atualização — {itemRevisao.titulo}
          </p>
          <p className="font-sans text-[13px] text-[var(--color-ink-sub)]">
            Explique o que o cliente precisa corrigir ou reenviar.
          </p>
          <textarea
            value={revisaoMsg}
            onChange={(e) => setRevisaoMsg(e.target.value)}
            rows={3}
            placeholder="Ex.: A data está ilegível. Envie uma foto nítida da frente e do verso."
            className="w-full resize-y rounded-[10px] border border-[rgba(42,37,32,0.12)] bg-[var(--color-cream)] px-3.5 py-2.5 font-sans text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-green)]"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => { setRevisaoId(null); setRevisaoMsg('') }}>Cancelar</GhostBtn>
            <button
              type="button"
              onClick={confirmarRevisao}
              className="rounded-[10px] bg-[var(--color-terracotta)] px-4 py-2 font-sans text-[13px] font-semibold text-white hover:opacity-90"
            >
              Enviar pedido
            </button>
          </div>
        </div>
      )}

      <section className="rounded-[18px] border border-[rgba(42,37,32,0.07)] bg-white p-6 shadow-[0_2px_12px_rgba(42,37,32,0.04)]">
        <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
          Processo
        </p>
        <h2 className="mb-5 font-serif text-[18px] font-semibold text-[var(--color-ink)]">
          Documentos do serviço
        </h2>

        {itens.length === 0 ? (
          <p className="font-sans text-[14px] text-[var(--color-ink-muted)]">
            Nenhum documento neste processo ainda.
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(42,37,32,0.06)]">
            {itens.map((item) => (
              <DocumentoRow
                key={item.id}
                item={item}
                onBaixar={() => downloadSolicitacaoArquivo(item)}
                onAprovar={() => setStatus(item.id, 'aprovado')}
                onRevisao={() => setStatus(item.id, 'em_revisao')}
                onAtualizar={() => abrirRevisao(item.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function DocumentoRow({
  item,
  onBaixar,
  onAprovar,
  onRevisao,
  onAtualizar,
}: {
  item: Solicitacao
  onBaixar: () => void
  onAprovar: () => void
  onRevisao: () => void
  onAtualizar: () => void
}) {
  const podeBaixar =
    Boolean(item.arquivo) &&
    (item.status === 'enviado' || item.status === 'em_revisao' || item.status === 'aprovado')
  const emAnalise = item.status === 'enviado' || item.status === 'em_revisao'

  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[14.5px] font-semibold text-[var(--color-ink)]">
          {item.status === 'aprovado' || item.status === 'em_revisao' || item.status === 'enviado'
            ? '✓ '
            : '○ '}
          {item.titulo}
        </p>
        <p className="mt-0.5 font-sans text-[12.5px] text-[var(--color-ink-muted)]">
          {statusLabel(item.status)}
          {item.arquivo ? ` · ${item.arquivo}` : ''}
          {` · por ${item.solicitadoPor.split(' ')[0]}`}
        </p>
        {item.comentario && (
          <p className="mt-2 max-w-[520px] font-sans text-[12.5px] leading-[1.5] text-[var(--color-ink-sub)]">
            “{item.comentario}”
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px] sm:items-stretch">
        {item.status === 'pendente' && (
          <p className="font-sans text-[12px] font-semibold text-[var(--color-terracotta)] sm:text-right">
            Aguardando cliente
          </p>
        )}

        {podeBaixar && (
          <OutlineBtn onClick={onBaixar}>Baixar</OutlineBtn>
        )}

        {emAnalise && (
          <div className="flex flex-col gap-2">
            <PrimaryBtn onClick={onAprovar}>Aprovar</PrimaryBtn>
            {item.status === 'enviado' && (
              <OutlineBtn onClick={onRevisao}>Marcar em revisão</OutlineBtn>
            )}
            <GhostBtn onClick={onAtualizar}>Pedir atualização</GhostBtn>
          </div>
        )}
      </div>
    </li>
  )
}

function PrimaryBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[10px] bg-[var(--color-green)] px-3.5 py-2 font-sans text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  )
}

function OutlineBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[10px] border border-[rgba(42,37,32,0.12)] bg-white px-3.5 py-2 font-sans text-[12.5px] font-semibold text-[var(--color-ink-sub)] transition-colors hover:border-[rgba(42,37,32,0.2)] hover:text-[var(--color-ink)]"
    >
      {children}
    </button>
  )
}

function GhostBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[10px] px-3.5 py-2 font-sans text-[12.5px] font-semibold text-[var(--color-ink-muted)] transition-colors hover:bg-[rgba(42,37,32,0.05)] hover:text-[var(--color-ink-sub)]"
    >
      {children}
    </button>
  )
}
