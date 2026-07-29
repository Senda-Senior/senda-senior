/**
 * shellHeader.tsx
 * Título/subtítulo do topbar — mapa por rota + override opcional (ex.: nome do cliente).
 *
 * Conecta: AppShell | pages dinâmicas via ShellPageMeta
 * Camada: browser
 */

'use client'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'

export type ShellHeader = {
  title: string
  subtitle?: string
}

const PAGE_META: Record<string, ShellHeader> = {
  '/dashboard': {
    title: 'Painel',
    subtitle: 'Colabore com sua assessoria para concluir seu processo.',
  },
  '/vault': {
    title: 'Documentos',
    subtitle: 'Arquivos do seu processo, sob seu controle.',
  },
  '/vault/saude': {
    title: 'Histórico Médico',
    subtitle: 'Medicamentos, médicos e informações de saúde centralizados.',
  },
  '/vault/juridico': {
    title: 'Documentos e Procurações',
    subtitle: 'Testamentos, diretrizes antecipadas e procurações organizadas.',
  },
  '/solicitacoes': {
    title: 'Solicitações',
    subtitle: 'O que sua assessoria pediu para esta etapa.',
  },
  '/assessoria': {
    title: 'Assessoria',
    subtitle: 'Quem acompanha o seu processo.',
  },
  '/configuracoes': {
    title: 'Configurações',
    subtitle: 'Gerencie sua conta e segurança.',
  },
  '/equipe': {
    title: 'Visão assessora',
    subtitle: 'Lista de clientes.',
  },
  '/rede-de-confianca': {
    title: 'Rede de Confiança',
    subtitle: 'Gerencie quem acessa quais informações.',
  },
}

function resolveFromPath(pathname: string): ShellHeader {
  if (PAGE_META[pathname]) return PAGE_META[pathname]
  if (pathname.startsWith('/equipe/')) {
    return { title: 'Cliente', subtitle: 'Processo do cliente.' }
  }
  if (pathname.startsWith('/vault/')) {
    return PAGE_META['/vault']
  }
  return { title: 'Senda Sênior' }
}

type Override = { path: string; header: ShellHeader }

const ShellHeaderValueContext = createContext<ShellHeader>({ title: 'Senda Sênior' })
const ShellHeaderSetContext = createContext<((header: ShellHeader | null) => void) | null>(null)

export function ShellHeaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [override, setOverrideState] = useState<Override | null>(null)

  const fallback = useMemo(() => resolveFromPath(pathname), [pathname])

  const setOverride = useMemo(() => {
    return (header: ShellHeader | null) => {
      if (!header) {
        setOverrideState(null)
        return
      }
      setOverrideState({ path: pathname, header })
    }
  }, [pathname])

  // Só aplica override se ainda é da rota atual (evita título do cliente grudado).
  const header =
    override && override.path === pathname ? override.header : fallback

  return (
    <ShellHeaderSetContext.Provider value={setOverride}>
      <ShellHeaderValueContext.Provider value={header}>
        {children}
      </ShellHeaderValueContext.Provider>
    </ShellHeaderSetContext.Provider>
  )
}

export function useShellHeader(): ShellHeader {
  return useContext(ShellHeaderValueContext)
}

/** Override pontual do título do shell (páginas com título dinâmico). */
export function ShellPageMeta({ title, subtitle }: ShellHeader) {
  const setOverride = useContext(ShellHeaderSetContext)

  useLayoutEffect(() => {
    setOverride?.({ title, subtitle })
    return () => setOverride?.(null)
  }, [setOverride, title, subtitle])

  return null
}
