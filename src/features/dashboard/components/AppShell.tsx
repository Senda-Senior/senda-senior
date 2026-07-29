'use client'

/**
 * AppShell.tsx
 * Shell autenticado — sidebar, topbar e menu do usuário (com foto de perfil opcional).
 *
 * Conecta: AppSidebar | signOutAction | pages protegidas
 * Camada: browser (use client)
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { Menu, Settings, LogOut, ChevronDown } from 'lucide-react'
import { AppSidebar } from './AppSidebar'
import { signOutAction } from '../actions'
import { clearAllMockStores } from '@/features/assessoria/mockStore'

interface AppShellProps {
  firstName: string
  displayName: string
  avatarUrl?: string | null
  showEquipeNav?: boolean
  pageTitle: string
  pageSubtitle?: string
  children: ReactNode
}

export function AppShell({
  firstName,
  displayName,
  avatarUrl,
  showEquipeNav = false,
  pageTitle,
  pageSubtitle,
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--color-cream)]">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showEquipeNav={showEquipeNav}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[rgba(42,37,32,0.08)] bg-[rgba(233,226,210,0.92)] px-5 backdrop-blur-md lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex-shrink-0 rounded-[8px] p-2 text-[var(--color-ink-sub)] transition-colors hover:bg-[rgba(42,37,32,0.06)] lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={19} strokeWidth={1.9} />
            </button>

            <div className="min-w-0">
              <p className="truncate font-serif text-[17px] font-semibold leading-tight tracking-[-0.01em] text-[var(--color-ink)]">
                {pageTitle}
              </p>
              {pageSubtitle && (
                <p className="hidden truncate font-sans text-[11.5px] text-[var(--color-ink-muted)] sm:block">
                  {pageSubtitle}
                </p>
              )}
            </div>
          </div>

          <UserMenu firstName={firstName} displayName={displayName} avatarUrl={avatarUrl} />
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

function UserMenu({
  firstName,
  displayName,
  avatarUrl,
}: {
  firstName: string
  displayName: string
  avatarUrl?: string | null
}) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    clearAllMockStores()
    try { await signOutAction() } catch { setLoggingOut(false) }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-[10px] bg-[rgba(45,95,79,0.07)] px-3 py-2 transition-colors hover:bg-[rgba(45,95,79,0.12)]"
      >
        <Avatar firstName={firstName} avatarUrl={avatarUrl} size="sm" />
        <span className="hidden font-sans text-[13.5px] font-medium text-[var(--color-ink-sub)] sm:block">
          {displayName}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`hidden text-[var(--color-ink-muted)] transition-transform sm:block ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-[12px] border border-[rgba(42,37,32,0.08)] bg-white p-1.5 shadow-[0_8px_28px_rgba(42,37,32,0.14)]"
        >
          <div className="border-b border-[rgba(42,37,32,0.06)] px-3 py-2.5 sm:hidden">
            <p className="truncate font-sans text-[13.5px] font-semibold text-[var(--color-ink)]">
              {displayName}
            </p>
          </div>
          <Link
            href="/configuracoes"
            prefetch={false}
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 font-sans text-[13.5px] font-medium text-[var(--color-ink-sub)] no-underline transition-colors hover:bg-[rgba(42,37,32,0.05)]"
          >
            <Settings size={15} strokeWidth={1.8} />
            Configurações
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2.5 font-sans text-[13.5px] font-medium text-[var(--color-danger)] transition-colors hover:bg-[rgba(185,28,28,0.06)] disabled:opacity-50"
          >
            <LogOut size={15} strokeWidth={1.8} />
            {loggingOut ? 'Saindo...' : 'Sair da conta'}
          </button>
        </div>
      )}
    </div>
  )
}

const AVATAR_SIZE = {
  sm: { box: 'h-[30px] w-[30px]', text: 'text-[13px]', img: '30px' },
  lg: { box: 'h-16 w-16', text: 'text-[22px]', img: '64px' },
} as const

export function Avatar({
  firstName,
  avatarUrl,
  size = 'sm',
}: {
  firstName: string
  avatarUrl?: string | null
  size?: keyof typeof AVATAR_SIZE
}) {
  const s = AVATAR_SIZE[size]

  if (avatarUrl) {
    return (
      <span className={`relative flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-green-muted)] ${s.box}`}>
        <NextImage src={avatarUrl} alt="" fill className="object-cover" sizes={s.img} />
      </span>
    )
  }

  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-green)] font-sans font-bold text-white ${s.box} ${s.text}`}
    >
      {firstName[0]?.toUpperCase()}
    </span>
  )
}
