/**
 * ScrollToTop.tsx
 * Botão flutuante voltar ao topo — usa Lenis easing exponencial, aparece nos últimos 15% da página
 *
 * Conecta: useLenis de lenis/react | motion de framer-motion
 * Camada: browser
 */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useEffect, useState } from 'react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      setVisible(scrolled > total * 0.85)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    lenis?.scrollTo(0, {
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={handleClick}
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="ios-stable-surface fixed bottom-6 left-1/2 z-[150] -translate-x-1/2 flex items-center gap-[9px] rounded-full border border-[rgba(42,37,32,0.12)] bg-[rgba(233,226,210,0.72)] px-5 py-[11px] font-sans text-[13.5px] font-semibold text-[var(--color-ink)] shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-[14px]"
          aria-label="Voltar ao início"
          style={{ WebkitBackdropFilter: 'blur(14px)' }}
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
            <ArrowUp size={12} strokeWidth={2.4} />
          </span>
          Voltar ao início
        </motion.button>
      )}
    </AnimatePresence>
  )
}
