/**
 * VaultView.tsx
 * Página principal do vault — grid de arquivos, filtros por categoria, busca, quota, uploader
 *
 * Conecta: renderizado pela página /vault; passa props para VaultUploader, VaultFileCard, VaultCategoryBanner
 * Camada: browser (use client)
 */

'use client'

import { useMemo, useState } from 'react'
import { Search, Trash2, Files as FilesIcon } from 'lucide-react'
import { ErrorBoundary } from '@/design'
import { VaultUploader } from './VaultUploader'
import { VaultFileRow } from './VaultFileCard'
import { VaultCategoryBanner } from './VaultCategoryBanner'
import type { VaultCategory, VaultFile, VaultQuota } from '@/features/vault/types'

interface Props {
  quota: VaultQuota
  categories: VaultCategory[]
  files: VaultFile[]
  trashedFiles: VaultFile[]
  userEmail: string
  displayName: string
  initialCategorySlug?: string
}

export function VaultView({ quota, categories, files, trashedFiles, initialCategorySlug }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(initialCategorySlug ?? null)
  const [search, setSearch] = useState('')
  const [showTrash, setShowTrash] = useState(false)

  const trashedCount = trashedFiles.length

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const base = showTrash ? trashedFiles : files
    return base.filter((f) => {
      if (!showTrash && activeSlug && f.category?.slug !== activeSlug) return false
      if (q && !f.displayName.toLowerCase().includes(q)) return false
      return true
    })
  }, [files, trashedFiles, showTrash, activeSlug, search])

  const systemCats = categories.filter((c) => c.type === 'system')

  const countsBySlug = useMemo(() => {
    const m = new Map<string, number>()
    for (const f of files) {
      if (f.category?.slug) {
        m.set(f.category.slug, (m.get(f.category.slug) ?? 0) + 1)
      }
    }
    return m
  }, [files])

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: 'clamp(24px, 4vw, 44px) clamp(20px, 4vw, 48px) 80px',
      }}
    >
      <ErrorBoundary>
        {/* Hero */}
        <div className="mb-5 overflow-hidden rounded-[20px] bg-[var(--color-olive)] px-8 py-9">
          <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-cream)] opacity-55">
            Arquivo Seguro
          </p>
          <h1 className="mb-2 font-serif text-[clamp(26px,3vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-cream)]">
            Cofre
          </h1>
          <p className="mb-4 max-w-md font-sans text-[14px] leading-[1.65] text-[var(--color-cream)] opacity-70">
            Seus documentos organizados e seguros em um só lugar.
          </p>
          <p className="font-sans text-[13px] text-[var(--color-cream)] opacity-50">
            {quota.fileCount} arquivo(s) · {(quota.usedBytes / (1024 * 1024)).toFixed(1)} / {(quota.limitBytes / (1024 * 1024)).toFixed(0)} MB
          </p>
        </div>

        {/* Upload */}
        <div className="mb-5 overflow-hidden rounded-[16px] border border-[rgba(42,37,32,0.07)] bg-white p-5 shadow-[0_2px_8px_rgba(42,37,32,0.04)]">
          <VaultUploader />
        </div>

        {/* Filtros + Busca */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryChip
              label="Todos"
              count={files.filter((f) => !f.deletedAt).length}
              active={activeSlug === null && !showTrash}
              onClick={() => { setActiveSlug(null); setShowTrash(false) }}
              color="var(--color-green-dark)"
              icon={<FilesIcon size={13} />}
            />
            {systemCats.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.label}
                count={countsBySlug.get(c.slug) ?? 0}
                active={activeSlug === c.slug && !showTrash}
                onClick={() => { setActiveSlug(c.slug); setShowTrash(false) }}
                color={c.color ?? '#999'}
              />
            ))}
            {trashedCount > 0 && (
              <CategoryChip
                label="Lixeira"
                count={trashedCount}
                active={showTrash}
                onClick={() => { setShowTrash((v) => !v); setActiveSlug(null) }}
                color="#B91C1C"
                icon={<Trash2 size={13} />}
              />
            )}
          </div>

          <div style={{ position: 'relative', flex: '0 0 auto' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-ink-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              id="vault-search"
              name="q"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              autoComplete="off"
              style={{
                width: 200,
                padding: '9px 12px 9px 33px',
                borderRadius: 10,
                border: '1.5px solid rgba(45, 61, 45, 0.12)',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                background: 'white',
                outline: 'none',
                color: 'var(--color-ink)',
              }}
            />
          </div>
        </div>

        {activeSlug && <VaultCategoryBanner slug={activeSlug} />}

        {/* Lista de arquivos */}
        <section>
          {filtered.length === 0 ? (
            <EmptyState isFiltered={activeSlug !== null || search.trim().length > 0 || showTrash} />
          ) : (
            <div className="overflow-hidden rounded-[14px] border border-[rgba(42,37,32,0.08)] bg-white shadow-[0_2px_8px_rgba(42,37,32,0.04)]">
              {filtered.map((f) => (
                <VaultFileRow key={f.id} file={f} categories={categories} />
              ))}
            </div>
          )}
        </section>
      </ErrorBoundary>
    </main>
  )
}


function CategoryChip({
  label, count, active, onClick, color, icon,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  color: string
  icon?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 20,
        border: `1.5px solid ${active ? color : 'rgba(45, 61, 45, 0.12)'}`,
        background: active ? color : 'rgba(255,255,255,0.95)',
        color: active ? 'white' : 'var(--color-ink)',
        fontSize: 14.95,
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      {label}
      <span
        style={{
          fontSize: 12.65,
          padding: '1px 6px',
          borderRadius: 8,
          background: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
          color: active ? 'white' : 'var(--color-ink-muted)',
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </button>
  )
}

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, var(--color-cream) 100%)',
        borderRadius: 14,
        border: '1px solid rgba(45, 61, 45, 0.1)',
      }}
    >
      <FilesIcon size={32} color="var(--color-ink-muted)" style={{ marginBottom: 12 }} />
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 19.55,
        color: 'var(--color-ink)',
        marginBottom: 6,
      }}>
        {isFiltered ? 'Nenhum arquivo encontrado' : 'Seu cofre está vazio'}
      </p>
      <p style={{ fontSize: 16.1, color: 'var(--color-ink-sub)', maxWidth: 420, margin: '0 auto' }}>
        {isFiltered
          ? 'Tente ajustar os filtros ou a busca.'
          : 'Arraste documentos para a área acima — eles serão organizados automaticamente.'}
      </p>
    </div>
  )
}
