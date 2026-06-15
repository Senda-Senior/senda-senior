/**
 * DigitalReader.tsx
 * Leitor visual interativo dos capítulos do manual com navegação lateral, modo foco, scroll progress bar, e transições suaves.
 *
 * Conecta: importa manualChapters de @/features/manual/data | importado por rota dinâmica /manual/[slug]
 * Camada: browser ('use client')
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Menu, X, Eye, EyeOff, Compass } from 'lucide-react'
import Link from 'next/link'
import { manualChapters } from '@/features/manual/data'

export interface DigitalReaderProps {
  initialChapterSlug: string
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function DigitalReader({ initialChapterSlug }: DigitalReaderProps) {
  const currentChapterIndex = manualChapters.findIndex((c) => c.slug === initialChapterSlug)
  const chapter = manualChapters[currentChapterIndex] || manualChapters[0]

  const [focusMode, setFocusMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    // Avoid reading window size during render; keep it client-only and reactive.
    const mql = window.matchMedia('(max-width: 999px)') // matches the previous `< 1000` behavior
    const sync = () => setIsNarrow(mql.matches)
    sync()

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', sync)
      return () => mql.removeEventListener('change', sync)
    }

    // Safari fallback — addListener/removeListener are deprecated but required for Safari < 14
    mql.addListener(sync)
    return () => mql.removeListener(sync)
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-cream)]">

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 340 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="z-50 overflow-hidden border-r border-r-[rgba(0,0,0,0.04)] bg-[rgba(254,252,249,0.7)] backdrop-blur-[30px]"
      >
         <div className="flex h-full w-[340px] flex-col p-8">
            <Link href="/" className="mb-12 flex shrink-0 items-center gap-3 no-underline text-[var(--color-green)]">
               <Compass size={24} strokeWidth={1.5} />
               <span className="text-[20.7px] font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>Senda Sênior</span>
            </Link>

            <p className="label-premium mb-6 shrink-0 text-[var(--color-ink-muted)]">Índice Temático</p>

            <div className="flex flex-col gap-2 overflow-y-auto pb-16">
               {manualChapters.map((ch) => (
                 <Link key={ch.slug} href={`/manual/${ch.slug}`} className="no-underline">
                   <motion.div
                     className="rounded-xl p-4 text-[17.25px] transition-all duration-200"
                     style={{
                       background: ch.slug === chapter.slug ? 'var(--color-green)' : 'transparent',
                       color: ch.slug === chapter.slug ? 'white' : 'var(--color-ink-sub)',
                       fontWeight: ch.slug === chapter.slug ? 600 : 500,
                       border: ch.slug === chapter.slug ? 'none' : '1px solid transparent',
                     }}
                     whileHover={{
                       background: ch.slug === chapter.slug ? 'var(--color-green)' : 'rgba(45,95,79,0.03)',
                       borderColor: ch.slug === chapter.slug ? 'transparent' : 'rgba(0,0,0,0.05)',
                     }}
                   >
                     {ch.title}
                   </motion.div>
                 </Link>
               ))}
            </div>
         </div>
      </motion.aside>

      <div
        className="relative flex h-screen flex-1 flex-col"
        style={{ opacity: focusMode && sidebarOpen ? 0.3 : 1, transition: 'opacity 0.4s' }}
      >

        <motion.header
          animate={{ y: focusMode ? -100 : 0, opacity: focusMode ? 0 : 1 }}
          className="absolute left-0 right-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-[var(--color-cream)] to-transparent py-6"
          style={{
            paddingLeft: 'clamp(20px, 4vw, 40px)',
            paddingRight: 'clamp(20px, 4vw, 40px)',
            pointerEvents: focusMode ? 'none' : 'auto',
          }}
        >
           <button
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="flex cursor-pointer items-center gap-3 rounded-[30px] border border-[rgba(0,0,0,0.04)] bg-white px-6 py-3 font-semibold text-[var(--color-ink)] transition-all duration-200"
           >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              {sidebarOpen ? 'Fechar Índice' : 'Sumário Completo'}
           </button>

           <button
             onClick={() => { setFocusMode(true); setSidebarOpen(false) }}
             className="flex cursor-pointer items-center gap-3 rounded-[30px] border-0 bg-[var(--color-green)] px-6 py-3 font-semibold text-white transition-all duration-200"
           >
              <EyeOff size={18} />
              Modo Foco
           </button>
        </motion.header>

        <motion.div
           className="fixed top-0 right-0 z-[100] h-1 bg-[var(--color-terracotta)]"
           style={{ left: sidebarOpen ? 340 : 0, scaleX, originX: 0, transition: 'left 0.3s' }}
        />

        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto"
          style={{ padding: '160px clamp(20px, 4vw, 40px) 120px', scrollBehavior: 'smooth' }}
        >

           <AnimatePresence>
             {focusMode && (
                 <motion.button
                   initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                   onClick={() => setFocusMode(false)}
                   className="fixed bottom-10 right-10 z-[60] cursor-pointer rounded-full border border-[rgba(0,0,0,0.08)] bg-white p-4 text-[var(--color-green)]"
                 >
                   <Eye size={24} />
                </motion.button>
             )}
           </AnimatePresence>

           <article
             className="mx-auto max-w-[740px]"
             style={{ opacity: sidebarOpen && isNarrow ? 0.3 : 1, transition: 'opacity 0.3s' }}
             onClick={() => sidebarOpen && isNarrow && setSidebarOpen(false)}
           >
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
                <p className="label-premium mb-5">{chapter.subtitle}</p>
                <h1
                  className="mb-0 font-medium leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)]"
                  style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 64px)' }}
                >
                  {chapter.title}
                </h1>
                <div className="line-terracota mb-20" />

                <div className="flex flex-col gap-10">
                   {chapter.content.map((paragraph, idx) => {
                     const isHighlight = paragraph.startsWith('### ')
                     if (isHighlight) {
                       return (
                         <motion.h2
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-20% 0px' }}
                            className="mt-12 border-b-[1.5px] border-b-[rgba(45,95,79,0.15)] pb-4 text-[32px] font-semibold text-[var(--color-green)]"
                            style={{ fontFamily: 'var(--font-serif)' }}
                         >
                            {paragraph.replace('### ', '')}
                         </motion.h2>
                       )
                     }

                     const isImportant = paragraph.startsWith('**')
                     const isBullet = paragraph.startsWith('•')

                     return (
                       <motion.p
                         key={idx}
                         initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }}
                         className={cx(
                           'text-[24.15px] leading-[1.85]',
                           isBullet && 'pl-6',
                           isImportant &&
                              'rounded-2xl border border-[rgba(0,0,0,0.04)] bg-white px-10 py-8',
                         )}
                         style={{
                           color: isImportant ? 'var(--color-ink)' : 'rgba(42,37,41,0.88)',
                           fontWeight: isImportant ? 500 : 400,
                         }}
                         >
                          {paragraph.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                            pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part,
                          )}
                        </motion.p>
                     )
                   })}
                </div>
              </motion.div>

              <div className="mt-[120px] flex flex-row justify-between gap-6 border-t border-t-[rgba(0,0,0,0.08)] pt-16">
                 {currentChapterIndex > 0 ? (
                    <Link href={`/manual/${manualChapters[currentChapterIndex - 1].slug}`} className="flex flex-1 flex-col gap-3 rounded-xl bg-[rgba(0,0,0,0.02)] p-8 no-underline">
                       <span className="label-premium text-[var(--color-ink-muted)]">Capítulo Anterior</span>
                       <span className="text-[27.6px] font-medium text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-serif)' }}>{manualChapters[currentChapterIndex - 1].title}</span>
                    </Link>
                 ) : <div style={{ flex: 1 }} />}

                 {currentChapterIndex < manualChapters.length - 1 ? (
                    <Link href={`/manual/${manualChapters[currentChapterIndex + 1].slug}`} className="flex flex-1 flex-col gap-3 rounded-xl bg-[var(--color-green)] p-8 text-right no-underline">
                       <span className="label-premium text-white/60">Próxima Etapa</span>
                       <span className="text-[27.6px] font-medium text-white" style={{ fontFamily: 'var(--font-serif)' }}>{manualChapters[currentChapterIndex + 1].title}</span>
                    </Link>
                 ) : <div style={{ flex: 1 }} />}
              </div>
           </article>
        </div>
      </div>
    </div>
  )
}
