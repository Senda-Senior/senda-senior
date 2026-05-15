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
            className="flex w-full max-w-[min(100vw,655px)] flex-col items-center justify-center px-4"
          >
            {/* Símbolo (−5% vs tamanho anterior) */}
            <NextImage
              src="/white-logo.png"
              alt="Símbolo Senda Sênior"
              width={98}
              height={98}
              priority
              className="-mb-[clamp(8px,2.4vw,16px)] mx-auto block h-[clamp(85px,21.95vw,120px)] w-auto shrink-0 object-contain"
            />
            {/* Wordmark +20%; -mt maior anula espaço transparente do asset e aproxima do símbolo */}
            <NextImage
              src="/senda-logo-text-complete-nobg.webp"
              alt="Senda Sênior — planejamento e assessoria"
              width={874}
              height={312}
              priority
              className="-mt-[clamp(22px,7.5vw,46px)] mx-auto block h-auto w-[clamp(306px,106vw,499px)] max-w-[min(92vw,562px)] object-contain object-center"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
