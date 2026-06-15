/**
 * LogoutButton.tsx
 * Botão de logout na header do dashboard — chama signOutAction (server action) para fazer logout global.
 *
 * Conecta: importa signOutAction (actions) | importado por DashboardView
 * Camada: browser
 */

'use client'

import { useState } from 'react'
import { signOutAction } from '../actions'

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false)
  const [hover, setHover] = useState(false)

  async function handleLogout() {
    setIsPending(true)
    try {
      await signOutAction()
    } catch (error) {
      console.error('Erro ao sair:', error)
      setIsPending(false)
    }
  }

  return (
    <button
      id="dashboard-logout"
      onClick={handleLogout}
      disabled={isPending}
      aria-disabled={isPending ? true : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'rgba(185,28,28,0.15)' : 'rgba(185,28,28,0.08)',
        border: '1.5px solid',
        borderColor: hover ? '#B91C1C' : 'rgba(185,28,28,0.15)',
        borderRadius: 8,
        padding: '10px 20px',
        fontSize: 14,
        fontWeight: 600,
        color: '#B91C1C',
        cursor: isPending ? 'wait' : 'pointer',
        opacity: isPending ? 0.6 : 1,
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.3s',
      }}
    >
      {isPending ? 'Saindo...' : 'Sair'}
    </button>
  )
}

