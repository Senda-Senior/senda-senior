/**
 * VaultUploader.tsx
 * Componente drag-drop de upload — orquestra hashing, prepareUpload, upload, confirmUpload com UI de progresso
 *
 * Conecta: renderizado por VaultView; chama uploadFile (client/upload.ts), actions server-side
 * Camada: browser (use client)
 */

'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { uploadFile } from '@/features/vault/client/upload'
import { prepareUpload, confirmUpload } from '@/features/vault/actions'
import { VAULT_ERROR_MESSAGES, type VaultErrorCode } from '@/features/vault/errors'
import { VAULT_LIMITS, isBlockedExtension, extractExtension } from '@/features/vault/validation'

type Status =
  | { kind: 'idle' }
  | { kind: 'hashing'; name: string }
  | { kind: 'uploading'; name: string; percent: number }
  | { kind: 'confirming'; name: string }
  | { kind: 'success'; name: string }
  | { kind: 'error'; name: string; message: string }

export function VaultUploader() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [, startTransition] = useTransition()

  function openPicker() {
    inputRef.current?.click()
  }

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files)
    for (const file of list) {
      await handleSingle(file)
    }
    startTransition(() => router.refresh())
  }

  async function handleSingle(file: File) {
    const ext = extractExtension(file.name)
    if (isBlockedExtension(ext)) {
      setStatus({ kind: 'error', name: file.name, message: VAULT_ERROR_MESSAGES.blocked_ext })
      return
    }
    if (file.size > VAULT_LIMITS.maxFileSizeBytes) {
      setStatus({ kind: 'error', name: file.name, message: VAULT_ERROR_MESSAGES.too_large })
      return
    }

    setStatus({ kind: 'hashing', name: file.name })

    const result = await uploadFile(file, {
      prepareUpload,
      confirmUpload,
      onProgress: (phase, percent) => {
        if (phase === 'hashing') {
          setStatus({ kind: 'hashing', name: file.name })
        } else if (phase === 'uploading') {
          setStatus({ kind: 'uploading', name: file.name, percent })
        } else if (phase === 'confirming') {
          setStatus({ kind: 'confirming', name: file.name })
        }
      },
    })

    if (result.ok) {
      setStatus({ kind: 'success', name: file.name })
    } else {
      const code = result.error as VaultErrorCode | undefined
      const message = code && VAULT_ERROR_MESSAGES[code]
        ? VAULT_ERROR_MESSAGES[code]
        : 'Falha ao enviar arquivo.'
      setStatus({ kind: 'error', name: file.name, message })
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const borderColor = dragging ? 'var(--color-terracotta)' : 'rgba(45, 61, 45, 0.2)'
  const bg = dragging ? 'rgba(181, 114, 74, 0.06)' : 'rgba(255,255,255,0.7)'

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openPicker}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') openPicker()
      }}
      style={{
        border: `2px dashed ${borderColor}`,
        borderRadius: 16,
        padding: 32,
        background: bg,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'center',
      }}
    >
      <input
        ref={inputRef}
        id="vault-file-input"
        name="vaultFiles"
        type="file"
        multiple
        autoComplete="off"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ''
        }}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <UploadCloud size={36} color="var(--color-terracotta)" strokeWidth={1.5} />
        <div>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 19.55,
            color: 'var(--color-ink)',
            marginBottom: 4,
          }}>
            Arraste arquivos aqui ou clique para enviar
          </p>
          <p style={{ fontSize: 16.1, color: 'var(--color-ink-sub)' }}>
            Até {(VAULT_LIMITS.maxFileSizeBytes / (1024 * 1024)).toFixed(0)} MB por arquivo
          </p>
        </div>

        {status.kind !== 'idle' && (
          <StatusBadge status={status} />
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  if (status.kind === 'idle') return null

  const shared: React.CSSProperties = {
    marginTop: 12,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 14.95,
    fontFamily: 'var(--font-sans)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    maxWidth: 420,
  }

  if (status.kind === 'error') {
    return (
      <div style={{ ...shared, background: 'rgba(185,28,28,0.08)', color: '#B91C1C' }}>
        <AlertCircle size={16} />
        <span>
          <strong>{truncate(status.name)}:</strong> {status.message}
        </span>
      </div>
    )
  }

  if (status.kind === 'success') {
    return (
      <div style={{ ...shared, background: 'rgba(74, 94, 74, 0.1)', color: 'var(--color-green-dark)' }}>
        <CheckCircle2 size={16} />
        <span>{truncate(status.name)} enviado.</span>
      </div>
    )
  }

  const labels: Record<'hashing' | 'uploading' | 'confirming', string> = {
    hashing: 'Calculando hash…',
    uploading: 'Enviando…',
    confirming: 'Classificando…',
  }

  return (
    <div style={{ ...shared, background: 'rgba(45, 61, 45, 0.06)', color: 'var(--color-ink-sub)' }}>
      <Loader2 size={16} className="spinning" />
      <span>
        {labels[status.kind]} <strong>{truncate(status.name)}</strong>
        {status.kind === 'uploading' && ` (${status.percent}%)`}
      </span>
      <style>{`.spinning { animation: vault-spin 1s linear infinite; } @keyframes vault-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function truncate(s: string, n = 32): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}
