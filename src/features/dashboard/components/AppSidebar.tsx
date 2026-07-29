'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen, ClipboardList, Handshake, UsersRound, Settings, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { signOutAction } from '../actions'
import { clearAllMockStores } from '@/features/assessoria/mockStore'

const NAV_BASE = [
  { icon: LayoutDashboard, label: 'Painel', href: '/dashboard' },
  { icon: FolderOpen, label: 'Documentos', href: '/vault' },
  { icon: ClipboardList, label: 'Solicitações', href: '/solicitacoes' },
  { icon: Handshake, label: 'Assessoria', href: '/assessoria' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
] as const

const NAV_EQUIPE = { icon: UsersRound, label: 'Visão assessora', href: '/equipe' } as const

interface AppSidebarProps {
  open: boolean
  onClose: () => void
  showEquipeNav?: boolean
}

function SidebarContent({
  onClose,
  showEquipeNav,
}: {
  onClose: () => void
  showEquipeNav: boolean
}) {
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)

  const nav = showEquipeNav
    ? [
        ...NAV_BASE.slice(0, 4),
        NAV_EQUIPE,
        NAV_BASE[4],
      ]
    : [...NAV_BASE]

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname === href || pathname.startsWith(href + '/')
  }

  async function handleLogout() {
    setLoggingOut(true)
    clearAllMockStores()
    try { await signOutAction() } catch { setLoggingOut(false) }
  }

  return (
    <div className="flex h-full flex-col bg-[var(--color-olive)]">
      {/* Logo + close */}
      <div className="flex items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center no-underline" onClick={onClose}>
          <NextImage
            src="/brand/logo-white-only.webp"
            alt=""
            width={72}
            height={72}
            className="h-auto w-[36px] flex-shrink-0"
          />
          <NextImage
            src="/senda-logo-corrido-w.webp"
            alt="Senda Sênior"
            width={170}
            height={44}
            className="-ml-1 h-auto w-[96px]"
          />
        </Link>
        <button
          onClick={onClose}
          className="rounded-[8px] p-1.5 text-[var(--color-cream-60)] transition-colors hover:bg-[rgba(233,226,210,0.1)] hover:text-[var(--color-cream)] lg:hidden"
          aria-label="Fechar menu"
        >
          <X size={17} strokeWidth={2} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 h-px bg-[rgba(233,226,210,0.1)]" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {nav.map(({ icon: Icon, label, href }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={[
                'flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-sans text-[13.5px] font-medium no-underline transition-colors duration-150',
                active
                  ? 'border-l-2 border-[var(--color-cream-60)] bg-[rgba(233,226,210,0.13)] pl-[10px] text-[var(--color-cream)]'
                  : 'text-[var(--color-cream-70)] hover:bg-[rgba(233,226,210,0.07)] hover:text-[var(--color-cream-85)]',
              ].join(' ')}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-6">
        <div className="mb-4 h-px bg-[rgba(233,226,210,0.1)]" />
        <p className="mb-5 font-sans text-[11px] leading-[1.65] text-[var(--color-cream-55)]">
          Colabore com sua assessoria<br />para concluir seu processo.
        </p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 font-sans text-[12.5px] font-medium text-[var(--color-cream-60)] transition-colors hover:bg-[rgba(233,226,210,0.08)] hover:text-[var(--color-cream-80)] disabled:opacity-50"
        >
          <LogOut size={14} strokeWidth={1.8} />
          {loggingOut ? 'Saindo...' : 'Sair da conta'}
        </button>
      </div>
    </div>
  )
}

export function AppSidebar({ open, onClose, showEquipeNav = false }: AppSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(42,37,32,0.45)] backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Sidebar — fixed on mobile (drawer), sticky on desktop */}
      <aside
        className={[
          'fixed left-0 top-0 z-50 h-full w-[240px] transition-transform duration-150 ease-[var(--ease-senda)]',
          'lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <SidebarContent onClose={onClose} showEquipeNav={showEquipeNav} />
      </aside>
    </>
  )
}
