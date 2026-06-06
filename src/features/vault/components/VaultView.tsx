'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { useMemo, useState } from 'react'
import { Search, Trash2, Files as FilesIcon } from 'lucide-react'
import { LogoutButton } from '@/features/dashboard/components/LogoutButton'
import { VaultUploader } from './VaultUploader'
import { VaultFileCard } from './VaultFileCard'
import type { VaultCategory, VaultFile, VaultQuota } from '@/features/vault/types'

interface Props {
  quota: VaultQuota
  categories: VaultCategory[]
  files: VaultFile[]
  trashedFiles: VaultFile[]
  userEmail: string
  displayName: string
}

export function VaultView({ quota, categories, files, trashedFiles, userEmail, displayName }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showTrash, setShowTrash] = useState(false)

  const trashedCount = trashedFiles.length
  // usa a primeira letra do NOME, não do email
  const userInitial = (displayName || userEmail)[0]?.toUpperCase() ?? 'U'

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
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--color-cream)' }}>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 100% 80% at 0% 0%, rgba(245,240,232,0.95) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(234,227,212,0.5) 0%, transparent 50%)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      <header
        className="dash-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0 clamp(20px, 4vw, 48px)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(245,239,230,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(45, 61, 45, 0.1)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 40px)' }}>
          <Link href="/" style={{ textDecoration: 'none', lineHeight: 0 }}>
            <NextImage
              src="/brand/logo-wordmark-dark.png"
              alt="Senda Sênior"
              width={220}
              height={64}
              style={{ height: 36, width: 'auto' }}
              priority
            />
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Link
              href="/dashboard"
              style={{
                fontSize: 17.25,
                fontWeight: 500,
                color: 'var(--color-ink-sub)',
                textDecoration: 'none',
              }}
            >
              Painel
            </Link>
            <span
              style={{
                fontSize: 17.25,
                fontWeight: 700,
                color: 'var(--color-green-dark)',
              }}
            >
              Cofre
            </span>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            className="dash-header-email"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 14px',
              borderRadius: 10,
              background: 'rgba(45,95,79,0.06)',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--color-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14.95,
                fontWeight: 700,
                color: 'white',
              }}
            >
              {userInitial}
            </div>
            <span style={{ fontSize: 16.1, fontWeight: 500, color: 'var(--color-ink-sub)' }}>
              {displayName || userEmail}
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 'clamp(28px, 4vw, 48px) clamp(20px, 4vw, 48px) 80px',
        }}
      >
        <section
          className="dashboard-hero"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
            gap: 'clamp(24px, 4vw, 40px)',
            alignItems: 'center',
            marginBottom: 36,
            padding: 'clamp(24px, 3.5vw, 40px)',
            borderRadius: 20,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, var(--color-cream) 100%)',
            border: '1px solid rgba(45, 61, 45, 0.1)',
            boxShadow: '0 24px 64px rgba(42, 37, 32, 0.08), 0 0 0 1px rgba(255,255,255,0.5) inset',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '-15%',
              right: '-10%',
              width: '45%',
              height: '70%',
              opacity: 0.1,
              background: 'radial-gradient(circle, rgba(181, 114, 74, 0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 16,
                flexWrap: 'wrap',
              }}
            >
              <NextImage
                src="/brand/star-scatter-decoration.jpg"
                alt=""
                width={120}
                height={120}
                style={{ width: 48, height: 'auto', opacity: 0.9 }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14.95,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-terracotta)',
                  margin: 0,
                }}
              >
                Arquivo seguro
              </p>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(30px, 3.4vw, 42px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                marginBottom: 10,
                lineHeight: 1.12,
              }}
            >
              Cofre
            </h1>
            <p
              style={{
                fontSize: 'clamp(18.4px, 1.61vw, 20.7px)',
                color: 'var(--color-ink-sub)',
                lineHeight: 1.6,
                fontWeight: 500,
                maxWidth: 440,
                marginBottom: 20,
              }}
            >
              Seus documentos organizados e seguros em um só lugar.
            </p>
            <div style={{ marginBottom: 20 }}>
              <QuotaWidget quota={quota} />
            </div>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 17.25,
                fontWeight: 600,
                color: 'var(--color-green)',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor',
                paddingBottom: 2,
              }}
            >
              Voltar ao painel
            </Link>
          </div>
          <div
            className="dashboard-hero-image"
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: 16,
              overflow: 'hidden',
              minHeight: 200,
            }}
          >
            <NextImage
              src="/brand/photos/prancheta-7.png"
              alt=""
              fill
              sizes="(max-width: 900px) 90vw, 400px"
              style={{
                objectFit: 'cover',
                objectPosition: '24% 38%',
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(245,240,232,0.45) 0%, transparent 40%), linear-gradient(0deg, rgba(32, 38, 30, 0.18) 0%, transparent 40%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </section>

        <div
          style={{
            padding: 'clamp(22px, 3.5vw, 32px)',
            borderRadius: 18,
            background: 'rgba(255,255,255,0.82)',
            border: '1px solid rgba(45, 61, 45, 0.1)',
            boxShadow: '0 12px 40px rgba(42, 37, 32, 0.06)',
          }}
        >
        <section style={{ marginBottom: 28 }}>
          <VaultUploader />
        </section>

        <section
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
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
        </section>

        <section style={{ marginBottom: 24 }}>
          <div style={{ position: 'relative', maxWidth: 420 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-ink-muted)',
              }}
            />
            <input
              id="vault-search"
              name="q"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome..."
              autoComplete="off"
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: 10,
                border: '1.5px solid rgba(45, 61, 45, 0.12)',
                fontSize: 17.25,
                fontFamily: 'var(--font-sans)',
                background: 'var(--color-cream)',
                outline: 'none',
                color: 'var(--color-ink)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-terracotta)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(181,114,74,0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(45, 61, 45, 0.12)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        </section>

        <section>
          {filtered.length === 0 ? (
            <EmptyState isFiltered={activeSlug !== null || search.trim().length > 0 || showTrash} />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
              }}
            >
              {filtered.map((f) => (
                <VaultFileCard key={f.id} file={f} categories={categories} />
              ))}
            </div>
          )}
        </section>
        </div>
      </main>
      </div>
    </div>
  )
}

function QuotaWidget({ quota }: { quota: VaultQuota }) {
  const usedMb = (quota.usedBytes / (1024 * 1024)).toFixed(1)
  const limitMb = (quota.limitBytes / (1024 * 1024)).toFixed(0)
  const pct = quota.usedPercentage
  const warn = pct >= 80

  return (
    <div style={{ minWidth: 220 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13.8,
          color: 'var(--color-ink-muted)',
          marginBottom: 6,
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span>{quota.fileCount} arquivo(s)</span>
        <span>
          {usedMb} / {limitMb} MB
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: 'rgba(74, 94, 74, 0.12)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, pct)}%`,
            height: '100%',
            background: warn ? '#B91C1C' : 'var(--color-terracotta)',
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
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
