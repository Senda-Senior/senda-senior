/**
 * VaultFileEditModal.tsx
 * Modal de edição — nome, descrição, categoria (com feedback loop de override), favorito
 *
 * Conecta: renderizado condicionalmente por VaultFileCard; chama updateMetadata server action
 * Camada: browser (use client)
 */

'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Star, X, Sparkles } from 'lucide-react'
import { updateMetadata } from '@/features/vault/actions'
import { VAULT_LIMITS } from '@/features/vault/validation'
import type { VaultCategory, VaultFile } from '@/features/vault/types'

interface Props {
  onClose: () => void
  file: VaultFile
  categories: VaultCategory[]
}

/**
 * Modal para editar metadata de um arquivo: nome exibido, descrição,
 * categoria manual, favorito. Troca de categoria vira override manual
 * (impede reclassificação automática futura).
 *
 * Sempre abre na montagem — o parent controla ciclo de vida via
 * renderização condicional. Isso garante estado inicial limpo e evita
 * o anti-padrão de sincronizar props com useState via useEffect.
 */
export function VaultFileEditModal({ onClose, file, categories }: Props) {
  const router = useRouter()
  const ref = useRef<HTMLDialogElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState(file.displayName)
  const [description, setDescription] = useState(file.description ?? '')
  const [categorySlug, setCategorySlug] = useState(file.category?.slug ?? 'outros')
  const [favorite, setFavorite] = useState(file.favorite)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!el.open) el.showModal()
    const handleClose = () => onClose()
    el.addEventListener('close', handleClose)
    return () => el.removeEventListener('close', handleClose)
  }, [onClose])

  const systemCategories = categories.filter((c) => c.type === 'system')
  const categoryChanged = categorySlug !== (file.category?.slug ?? 'outros')

  function handleSave() {
    setError(null)
    const trimmedName = displayName.trim()
    if (trimmedName.length === 0) {
      setError('Nome não pode ficar vazio.')
      return
    }
    if (trimmedName.length > VAULT_LIMITS.maxDisplayNameLength) {
      setError(`Nome deve ter no máximo ${VAULT_LIMITS.maxDisplayNameLength} caracteres.`)
      return
    }

    startTransition(async () => {
      const result = await updateMetadata({
        fileId: file.id,
        patch: {
          displayName: trimmedName,
          description: description.trim() || null,
          categorySlug: categoryChanged ? categorySlug : undefined,
          favorite,
        },
      })

      if (result.ok) {
        router.refresh()
        onClose()
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      style={{
        padding: 0,
        border: 'none',
        borderRadius: 14,
        maxWidth: 520,
        width: '90vw',
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      }}
    >
      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden' }}>
        {/* header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 19,
              color: 'var(--color-ink)',
            }}
          >
            Editar arquivo
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              color: 'var(--color-ink-muted)',
              borderRadius: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Nome exibido">
            <input
              id="vault-edit-display-name"
              name="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={VAULT_LIMITS.maxDisplayNameLength}
              disabled={isPending}
              style={inputStyle}
            />
          </Field>

          <Field label="Descrição" hint="Opcional. Ajuda a lembrar para que serve este arquivo.">
            <textarea
              id="vault-edit-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={VAULT_LIMITS.maxDescriptionLength}
              disabled={isPending}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-sans)' }}
            />
          </Field>

          <Field
            label="Categoria"
            hint={
              file.manualOverride
                ? 'Você já alterou manualmente.'
                : file.confidence !== null
                  ? `Sugerida automaticamente (${Math.round(file.confidence * 100)}% confiança).`
                  : undefined
            }
          >
            <select
              id="vault-edit-category"
              name="category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              disabled={isPending}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {systemCategories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
            {categoryChanged && !file.manualOverride && (
              <p
                style={{
                  fontSize: 13.8,
                  color: 'var(--color-ink-muted)',
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={12} />
                Alterar aqui vai desligar a classificação automática para este arquivo.
              </p>
            )}
          </Field>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              userSelect: 'none',
              fontSize: 16.1,
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <input
              id="vault-edit-favorite"
              name="favorite"
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              disabled={isPending}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <Star
              size={16}
              fill={favorite ? '#C89F54' : 'transparent'}
              color="#C89F54"
            />
            Marcar como favorito
          </label>

          {error && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(185,28,28,0.08)',
                color: '#B91C1C',
                fontSize: 14.95,
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            background: 'rgba(0,0,0,0.02)',
          }}
        >
          <button
            onClick={onClose}
            disabled={isPending}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: '1.5px solid rgba(0,0,0,0.1)',
              background: 'white',
              color: 'var(--color-ink)',
              fontSize: 16.1,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--color-green)',
              color: 'white',
              fontSize: 16.1,
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              cursor: isPending ? 'wait' : 'pointer',
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <style>{`
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </dialog>
  )
}

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 14.95,
          fontWeight: 600,
          color: 'var(--color-ink)',
          marginBottom: 6,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: 13.8, color: 'var(--color-ink-muted)', marginTop: 6 }}>
          {hint}
        </p>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1.5px solid rgba(0,0,0,0.1)',
  fontSize: 16.1,
  color: 'var(--color-ink)',
  background: 'white',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
}
