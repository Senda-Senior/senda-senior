'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Bloquear o scroll da página enquanto a splash screen está visível
    document.body.style.overflow = 'hidden'
    
    // Esconder a tela após 2.2 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = ''
    }, 2200)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} // var(--ease-senda)
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--color-sage-dark)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col items-center gap-0"
          >
            {/* Símbolo */}
            <NextImage
              src="/white-logo.png"
              alt="Símbolo Senda Sênior"
              width={98}
              height={98}
              priority
              style={{ width: 'auto', height: 'auto', objectFit: 'contain' }}
            />
            <NextImage
              src="/senda-logo-corrido-w.webp"
              alt="Senda Sênior"
              width={340}
              height={88}
              priority
              className="-mt-2 h-auto w-[clamp(148px,52vw,260px)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
