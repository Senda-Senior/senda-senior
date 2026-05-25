'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none' }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-[10px] z-[100]"
      aria-hidden="true"
    >
      <span 
        style={{ 
          color: 'var(--color-ink-sub)',
          opacity: 0.7,
          fontSize: '10px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.2em'
        }}
      >
        Role para descobrir
      </span>
      
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ArrowDown size={20} strokeWidth={1.2} style={{ color: 'var(--color-ink-sub)', opacity: 0.7 }} />
      </motion.div>
    </motion.div>
  )
}
