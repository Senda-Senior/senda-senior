/**
 * VaultFileCard.tsx
 * Card de arquivo — exibe nome, categoria, tamanho, ícone; menu com download, editar, favoritar, excluir
 *
 * Conecta: renderizado por VaultView em grid; abre VaultFileEditModal; chama ações (download, delete, restore)
 * Camada: browser (use client)
 */

'use client'

import { useRef, useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText, File as FileIcon, Image as ImageIcon, FileSpreadsheet,
  MoreVertical, Download, Trash2, Star, RotateCcw, Pencil, Eye,
} from 'lucide-react'
import {
  getDownloadUrl, softDelete, restore, updateMetadata,
} from '@/features/vault/actions'
import { SYSTEM_CATEGORIES_META, type SystemCategorySlug, isSystemCategory } from '@/features/vault/categories'
import type { VaultCategory, VaultFile } from '@/features/vault/types'
import { ConfirmDialog } from '@/design'
import { VaultFileEditModal } from './VaultFileEditModal'

interface Props {
  file: VaultFile
  categories: VaultCategory[]
}

export function VaultFileCard({ file, categories }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const inTrash = Boolean(file.deletedAt)

  function handleDownload() {
    setMenuOpen(false)
    startTransition(async () => {
      const result = await getDownloadUrl(file.id)
      if (result.ok) {
        window.open(result.data.url, '_blank', 'noopener,noreferrer')
      }
    })
  }

  function handleEdit() {
    setMenuOpen(false)
    setEditOpen(true)
  }

  function handleAskDelete() {
    setMenuOpen(false)
    setConfirmDelete(true)
  }

  function handleDelete() {
    startTransition(async () => {
      await softDelete(file.id)
      setConfirmDelete(false)
      router.refresh()
    })
  }

  function handleRestore() {
    setMenuOpen(false)
    startTransition(async () => {
      await restore(file.id)
      router.refresh()
    })
  }

  function handleToggleFavorite() {
    setMenuOpen(false)
    startTransition(async () => {
      await updateMetadata({
        fileId: file.id,
        patch: { favorite: !file.favorite },
      })
      router.refresh()
    })
  }

  const catMeta = file.category && isSystemCategory(file.category.slug)
    ? SYSTEM_CATEGORIES_META[file.category.slug as SystemCategorySlug]
    : null
  const catColor = catMeta?.color ?? file.category?.color ?? '#999'
  const catLabel = file.category?.label ?? 'Outros'

  return (
    <>
      <div
        style={{
          borderRadius: 14,
          padding: 16,
          border: '1px solid rgba(45, 61, 45, 0.1)',
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 2px 12px rgba(42, 37, 32, 0.04)',
          position: 'relative',
          opacity: isPending ? 0.6 : 1,
          transition: 'opacity 0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 160,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <FileTypeIcon mime={file.mimeType} extension={file.extension} />

          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Mais opções"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 4,
                borderRadius: 4,
                cursor: 'pointer',
                color: 'var(--color-ink-muted)',
              }}
            >
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  borderRadius: 8,
                  padding: 4,
                  minWidth: 180,
                  zIndex: 10,
                  marginTop: 4,
                }}
              >
                {!inTrash ? (
                  <>
                    <MenuItem icon={<Download size={14} />} onClick={handleDownload}>
                      Baixar
                    </MenuItem>
                    <MenuItem icon={<Pencil size={14} />} onClick={handleEdit}>
                      Editar
                    </MenuItem>
                    <MenuItem
                      icon={
                        <Star
                          size={14}
                          fill={file.favorite ? '#C89F54' : 'transparent'}
                          color="#C89F54"
                        />
                      }
                      onClick={handleToggleFavorite}
                    >
                      {file.favorite ? 'Desfavoritar' : 'Favoritar'}
                    </MenuItem>
                    <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
                    <MenuItem icon={<Trash2 size={14} />} onClick={handleAskDelete} variant="danger">
                      Excluir
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem icon={<RotateCcw size={14} />} onClick={handleRestore}>
                    Restaurar
                  </MenuItem>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p
            title={file.displayName}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16.1,
              fontWeight: 500,
              color: 'var(--color-ink)',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: 8,
              wordBreak: 'break-word',
            }}
          >
            {file.favorite && (
              <Star
                size={12}
                fill="#C89F54"
                stroke="#C89F54"
                style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }}
              />
            )}
            {file.displayName}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 4,
              background: catColor,
              color: 'white',
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {catLabel}
          </span>
          <span style={{ fontSize: 12.65, color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}>
            {formatSize(file.sizeBytes)}
          </span>
        </div>
      </div>

      {editOpen && (
        <VaultFileEditModal
          onClose={() => setEditOpen(false)}
          file={file}
          categories={categories}
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        variant="danger"
        title={`Excluir "${truncate(file.displayName, 40)}"?`}
        description="O arquivo vai para a lixeira. Você pode restaurar nos próximos 30 dias — depois disso é removido definitivamente."
        confirmLabel="Excluir"
        loading={isPending}
      />
    </>
  )
}

function MenuItem({
  icon, children, onClick, variant,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  variant?: 'danger'
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      role="menuitem"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 10px',
        border: 'none',
        borderRadius: 4,
        background: hover ? 'rgba(0,0,0,0.04)' : 'transparent',
        color: variant === 'danger' ? '#B91C1C' : 'var(--color-ink)',
        fontSize: 14.95,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      {icon}
      {children}
    </button>
  )
}

function FileTypeIcon({ mime, extension, size = 28 }: { mime: string; extension: string; size?: number }) {
  const color = 'var(--color-ink-muted)'

  if (mime.startsWith('image/')) {
    return <ImageIcon size={size} color={color} />
  }
  if (extension === 'pdf') {
    return <FileText size={size} color="#B91C1C" />
  }
  if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
    return <FileSpreadsheet size={size} color="#2D5F4F" />
  }
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'md'].includes(extension)) {
    return <FileText size={size} color="#3F6E5A" />
  }
  return <FileIcon size={size} color={color} />
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${d.getDate()} ${months[d.getMonth()]}. ${d.getFullYear()}`
}

export function VaultFileRow({ file, categories }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const inTrash = Boolean(file.deletedAt)

  function handleDownload() {
    setMenuOpen(false)
    startTransition(async () => {
      const result = await getDownloadUrl(file.id)
      if (result.ok) {
        window.open(result.data.url, '_blank', 'noopener,noreferrer')
      }
    })
  }

  function handleEdit() {
    setMenuOpen(false)
    setEditOpen(true)
  }

  function handleAskDelete() {
    setMenuOpen(false)
    setConfirmDelete(true)
  }

  function handleDelete() {
    startTransition(async () => {
      await softDelete(file.id)
      setConfirmDelete(false)
      router.refresh()
    })
  }

  function handleRestore() {
    setMenuOpen(false)
    startTransition(async () => {
      await restore(file.id)
      router.refresh()
    })
  }

  function handleToggleFavorite() {
    setMenuOpen(false)
    startTransition(async () => {
      await updateMetadata({ fileId: file.id, patch: { favorite: !file.favorite } })
      router.refresh()
    })
  }

  const catMeta = file.category && isSystemCategory(file.category.slug)
    ? SYSTEM_CATEGORIES_META[file.category.slug as SystemCategorySlug]
    : null
  const catColor = catMeta?.color ?? file.category?.color ?? '#999'
  const catLabel = file.category?.label ?? 'Outros'

  return (
    <>
      <div
        className="flex items-center gap-3 border-b border-[rgba(42,37,32,0.06)] px-4 py-3 last:border-b-0 hover:bg-[rgba(42,37,32,0.015)] transition-colors"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        <div className="flex-shrink-0 text-[var(--color-ink-muted)]">
          <FileTypeIcon mime={file.mimeType} extension={file.extension} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[14px] font-medium text-[var(--color-ink)]">
            {file.favorite && (
              <Star size={11} fill="#C89F54" stroke="#C89F54" className="mr-1 inline-block align-middle" />
            )}
            {file.displayName}
          </p>
          <p className="mt-0.5 font-sans text-[12px] text-[var(--color-ink-muted)]">
            <span style={{ color: catColor, fontWeight: 600 }}>{catLabel}</span>
            {' · '}{formatSize(file.sizeBytes)}
            {' · '}{formatDate(file.createdAt)}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-0.5">
          <button
            onClick={handleDownload}
            className="rounded-[6px] p-1.5 text-[var(--color-ink-muted)] transition-colors hover:bg-[rgba(42,37,32,0.06)] hover:text-[var(--color-ink)]"
            aria-label="Visualizar"
          >
            <Eye size={15} strokeWidth={1.8} />
          </button>
          <button
            onClick={handleDownload}
            className="rounded-[6px] p-1.5 text-[var(--color-ink-muted)] transition-colors hover:bg-[rgba(42,37,32,0.06)] hover:text-[var(--color-ink)]"
            aria-label="Baixar"
          >
            <Download size={15} strokeWidth={1.8} />
          </button>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-[6px] p-1.5 text-[var(--color-ink-muted)] transition-colors hover:bg-[rgba(42,37,32,0.06)] hover:text-[var(--color-ink)]"
              aria-label="Mais opções"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <MoreVertical size={15} strokeWidth={1.8} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 min-w-[180px] overflow-hidden rounded-[8px] border border-[rgba(42,37,32,0.08)] bg-white p-1 shadow-[0_4px_16px_rgba(42,37,32,0.12)]">
                {!inTrash ? (
                  <>
                    <MenuItem icon={<Pencil size={14} />} onClick={handleEdit}>Editar</MenuItem>
                    <MenuItem
                      icon={<Star size={14} fill={file.favorite ? '#C89F54' : 'transparent'} color="#C89F54" />}
                      onClick={handleToggleFavorite}
                    >
                      {file.favorite ? 'Desfavoritar' : 'Favoritar'}
                    </MenuItem>
                    <div className="my-1 h-px bg-[rgba(0,0,0,0.06)]" />
                    <MenuItem icon={<Trash2 size={14} />} onClick={handleAskDelete} variant="danger">
                      Excluir
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem icon={<RotateCcw size={14} />} onClick={handleRestore}>
                    Restaurar
                  </MenuItem>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <VaultFileEditModal onClose={() => setEditOpen(false)} file={file} categories={categories} />
      )}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        variant="danger"
        title={`Excluir "${truncate(file.displayName, 40)}"?`}
        description="O arquivo vai para a lixeira. Você pode restaurar nos próximos 30 dias — depois disso é removido definitivamente."
        confirmLabel="Excluir"
        loading={isPending}
      />
    </>
  )
}
