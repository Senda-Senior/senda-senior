'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hoveredText, setHoveredText] = useState<string | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const scale = useSpring(0.2, { stiffness: 500, damping: 28, mass: 0.5 })

  useEffect(() => {
    scale.set(hoveredText ? 1 : 0.2)
  }, [hoveredText, scale])

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(pointer: fine)')

    const updateEnabled = () => {
      setEnabled(!reduceMotionQuery.matches && pointerQuery.matches)
    }

    updateEnabled()
    reduceMotionQuery.addEventListener('change', updateEnabled)
    pointerQuery.addEventListener('change', updateEnabled)

    return () => {
      reduceMotionQuery.removeEventListener('change', updateEnabled)
      pointerQuery.removeEventListener('change', updateEnabled)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (reduceMotion || !finePointer) return

    let frame = 0
    let nextX = -100
    let nextY = -100
    const handleMouseMove = (e: MouseEvent) => {
      nextX = e.clientX
      nextY = e.clientY
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        x.set(nextX)
        y.set(nextY)
        frame = 0
      })
    }
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const text =
        target.getAttribute('data-cursor') ||
        target.closest('[data-cursor]')?.getAttribute('data-cursor')
      const nextText = text || null
      setHoveredText((prev) => (prev === nextText ? prev : nextText))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center"
      style={{
        x,
        y,
        scale,
      }}
    >
      {/* Cursor usa verde da marca — cor primária do design folder */}
      <div
        className="flex h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-green)] shadow-[0_8px_32px_var(--color-green-40)] transition-opacity duration-[200ms]"
        style={{ opacity: hoveredText ? 0.95 : 0 }}
      >
        <span className="p-[4px] text-center text-[10px] font-bold uppercase tracking-[1px] text-white">
          {hoveredText}
        </span>
      </div>
    </motion.div>
  )
}
