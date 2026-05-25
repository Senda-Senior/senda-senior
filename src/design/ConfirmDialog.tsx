'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  loading?: boolean
}

/**
 * Diálogo de confirmação reutilizável. Usa `<dialog>` nativo para
 * ganhar focus trap + Escape key gratuitamente.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleClose = () => onClose()
    el.addEventListener('close', handleClose)
    return () => el.removeEventListener('close', handleClose)
  }, [onClose])

  const danger = variant === 'danger'

  const titleId = `dialog-title-${danger ? 'danger' : 'default'}`

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-labelledby={titleId}
      aria-modal="true"
      className="w-[90vw] max-w-[440px] rounded-[14px] border-0 p-0 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="rounded-[14px] bg-white p-[28px]">
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          {danger && (
            <div
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 20,
                background: 'rgba(185,28,28,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} color="#B91C1C" />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2
              id={titleId}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 19,
                color: 'var(--color-ink)',
                marginBottom: description ? 6 : 0,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
            {description && (
              <p
                style={{
                  fontSize: 16.1,
                  color: 'var(--color-ink-muted)',
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button
            onClick={onClose}
            disabled={loading}
            aria-disabled={loading ? true : undefined}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: '1.5px solid rgba(0,0,0,0.1)',
              background: 'white',
              color: 'var(--color-ink)',
              fontSize: 16.1,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            aria-disabled={loading ? true : undefined}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: 'none',
              background: danger ? '#B91C1C' : 'var(--color-green)',
              color: 'white',
              fontSize: 16.1,
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Processando…' : confirmLabel}
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
