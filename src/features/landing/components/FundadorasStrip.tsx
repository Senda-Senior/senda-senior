'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Files, HeartHandshake, Users } from 'lucide-react'
import { Reveal } from '@/design'

import { CARDS } from '@/features/landing/data/fundadoras-strip'

const ICONS = {
  'book-open': BookOpen,
  'heart-handshake': HeartHandshake,
  files: Files,
  users: Users,
} as const

const SENDA_EASE = [0.25, 0.46, 0.45, 0.94] as const
const MOBILE_CARD_TRANSITION = {
  type: 'spring',
  stiffness: 260,
  damping: 32,
  mass: 0.9,
} as const
const MOBILE_CARD_RADIUS = 'var(--radius-lg)'

function ExpandedParceiros({ onClose, isMobile }: { onClose: () => void, isMobile?: boolean }) {
  const specialties = [
    'Quiropraxia',
    'Ortopedia',
    'Cardiologia',
    'Oftalmologia',
    'Fisioterapia',
    'Geriatria',
    'Nutrição',
    'Psicologia',
  ]

  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ delay: 0.2 }}
      className="flex flex-col h-full w-full pt-4 px-2"
    >
      {/* Top Header */}
      {!isMobile && (
        <div className="flex justify-between items-start w-full mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 border-2 border-[var(--color-terracotta)] text-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] hover:text-white transition-colors px-5 py-2.5 rounded-full font-sans text-sm font-bold"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar aos produtos
          </button>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-[var(--color-ink)]">
            Os Parceiros
          </h2>
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 w-full flex-1 items-center md:items-start pb-8 md:pb-0">
        {/* Text */}
        <div className="flex-1 flex flex-col justify-center relative w-full">
          {/* Dropdown Filters */}
          <div className="mb-8 relative w-[280px] z-20">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-sub)] mb-2 ml-1">
              Escolha a especialidade:
            </label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full bg-white border border-[var(--color-terracotta-light)] rounded-full px-5 py-3 cursor-pointer hover:border-[var(--color-terracotta)] transition-colors"
            >
              <span className="font-sans text-[15px] font-semibold text-[var(--color-ink)]">
                {selectedSpecialty}
              </span>
              <ChevronDown size={18} className={`text-[var(--color-terracotta)] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-[20px] shadow-xl border border-[rgba(42,37,32,0.08)] overflow-hidden"
                >
                  <div className="max-h-60 overflow-y-auto py-2">
                    {specialties.map(s => (
                      <div
                        key={s}
                        onClick={() => {
                          setSelectedSpecialty(s)
                          setIsDropdownOpen(false)
                        }}
                        className={`px-5 py-3 text-[14px] font-medium cursor-pointer transition-colors ${
                          selectedSpecialty === s 
                            ? 'bg-[var(--color-terracotta-light)] text-[var(--color-ink)]' 
                            : 'text-[var(--color-ink-sub)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]'
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="inline-flex px-3 py-1 rounded-full border border-[var(--color-terracotta-light)] text-[var(--color-terracotta)] text-[10px] font-bold tracking-widest uppercase mb-6 w-max">
            • Especialista em {selectedSpecialty}
          </div>
          <h3 className="font-serif text-4xl font-bold text-[var(--color-ink)] mb-6">
            Dr. Roberto Mendes
          </h3>
          <p className="font-sans text-[16.5px] leading-relaxed text-[var(--color-ink-sub)] mb-10 max-w-[90%]">
            Especialista em {selectedSpecialty.toLowerCase()} por mais de 15 anos. Possui longa
            experiência na área de <strong className="text-[var(--color-ink)]">cuidado com idosos</strong>, com foco em mobilidade,
            alívio de dores crônicas e qualidade de vida.
            <br />
            <br />
            Atua em parceria com nossa rede de apoio, oferecendo atendimento
            humanizado e personalizado para cada paciente.
          </p>
          <div>
            <Link href="/login" className="inline-flex items-center gap-3 bg-[var(--color-terracotta)] text-white px-8 py-3.5 rounded-full font-bold text-[13px] tracking-widest uppercase hover:opacity-90 transition-opacity">
              Acesse a nossa rede <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Photo */}
        <div className="w-full md:w-[340px] h-[260px] md:h-[340px] relative rounded-3xl overflow-hidden bg-[var(--color-terracotta-light)] shadow-sm flex-shrink-0 flex flex-col items-center justify-center">
          <NextImage
            src="/brand/photos/doutor_roberto.png"
            alt="Dr. Roberto Mendes"
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-cover object-[center_20%]"
          />
        </div>
      </div>
    </motion.div>
  )
}

export function FundadorasStrip() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const reduceMotion = useReducedMotion() ?? false
  const overlayRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Resolve o salto de rolagem: rola suavemente para o deck quando um card é ativado no mobile
  useEffect(() => {
    if (isMobile && activeCard && !reduceMotion) {
      const timeout = window.setTimeout(() => {
        const el = document.getElementById(`accordion-card-${activeCard}`)
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100 // 100px de respiro pro header
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 280) // Depois da abertura inicial, evita brigar com o layout spring.

      return () => window.clearTimeout(timeout)
    }
  }, [activeCard, isMobile, reduceMotion])

  useEffect(() => {
    if (isMobile === false && activeCard) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
    return () => { lenis?.start() }
  }, [activeCard, isMobile, lenis])

  useEffect(() => {
    if (isMobile || !activeCard) return
    const overlay = overlayRef.current
    if (!overlay) return
    const previousFocus = document.activeElement as HTMLElement
    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
    focusable[0]?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveCard(null); return }
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [activeCard, isMobile])

  return (
    <section
      id="sobre"
      style={{
        background: 'var(--color-cream)',
        position: 'relative',
        overflowX: 'hidden',  // only clip horizontal overflow
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 100px)',
      }}
    >
      {/* O Grid Base Sempre Renderiza */}
      <div
        className="landing-max grid-pillar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.02fr) minmax(0, 0.98fr)',
          gap: 'clamp(48px, 6vw, 80px)',
          alignItems: isMobile ? 'start' : 'center',
        }}
      >
        {/* Lado Esquerdo: Texto */}
        <div style={{ maxWidth: 620 }}>
          <Reveal>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13.8,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-terracotta)',
                marginBottom: 24,
              }}
            >
              Sobre nós
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(42px, 5vw, 68px)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                marginBottom: 40,
                textWrap: 'balance',
              }}
            >
              Nascemos<br />
              de quem<br />
              viveu na pele.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              className="landing-copy-justify"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(17.25px, 1.495vw, 18.4px)',
                lineHeight: 1.7,
                color: 'var(--color-ink-sub)',
                marginBottom: 36,
                maxWidth: 600,
              }}
            >
              A Senda Sênior nasceu da vivência real de mulheres que acompanharam de perto o envelhecimento de suas mães. Essa experiência se transformou em método, manuais e consultoria para famílias que querem se preparar, não improvisar.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div>
              <div
                style={{
                  width: 36,
                  height: 2,
                  background: 'var(--color-terracotta)',
                  borderRadius: 1,
                  marginBottom: 14,
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(17.25px, 1.495vw, 18.4px)',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  color: 'var(--color-ink)',
                }}
              >
                Somos a bússola que orienta o caminho.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Lado Direito: Grid de Cards 2x2 (desktop) ou Accordion (mobile) */}
        <div className="w-full relative">

          {/* Grid 2x2 — apenas no desktop. No mobile é sempre o accordion abaixo. */}
          {isMobile === false && (
            <div className="cards-grid" style={{ gap: 18 }}>
              <p
                style={{
                  gridColumn: '1 / -1',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-sub)',
                  marginBottom: 4,
                }}
              >
                Nossos produtos:
              </p>
              {CARDS.map((card) => {
                const Icon = ICONS[card.icon]

                return (
                  <motion.button
                    key={card.icon}
                    onClick={() => setActiveCard(card.icon)}
                    className="flex h-full min-h-[214px] w-full flex-col gap-[18px] overflow-hidden rounded-[18px] py-[30px] pl-[clamp(22px,2vw,28px)] pr-[clamp(22px,2vw,28px)] text-left outline-none hover:z-10 hover:scale-[1.015] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)]"
                    style={{
                      background: card.bg,
                      boxShadow: '0 18px 42px rgba(42, 37, 32, 0.08)',
                    }}
                  >
                    <motion.div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--color-ink)',
                      }}
                    >
                      <Icon size={42} strokeWidth={1.3} aria-hidden />
                    </motion.div>

                    <motion.div>
                      <motion.h3
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 18,
                          fontWeight: 600,
                          color: 'var(--color-ink)',
                          lineHeight: 1.25,
                          letterSpacing: '-0.01em',
                          marginBottom: 10,
                        }}
                      >
                        {card.title}
                      </motion.h3>
                      <motion.p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14.95,
                          lineHeight: 1.5,
                          color: 'var(--color-ink-sub)',
                          opacity: 0.9,
                        }}
                      >
                        {card.desc}
                      </motion.p>
                    </motion.div>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Accordion mobile — sempre visível no mobile, expandido ao clicar */}
          {isMobile === true && (
            <div id="deck-container" className="flex flex-col w-full relative scroll-mt-24">
              <div className="flex-1 flex flex-col overflow-visible relative">
                {CARDS.map((card, i) => {
                  const Icon = ICONS[card.icon]
                  const isActive = activeCard === card.icon

                  return (
                    <motion.div
                      id={`accordion-card-${card.icon}`}
                      key={card.icon}
                      layout="position"
                      role={!isActive ? 'button' : undefined}
                      tabIndex={!isActive ? 0 : undefined}
                      aria-expanded={isActive}
                      aria-label={card.title}
                      onClick={() => {
                          if (!isActive) setActiveCard(card.icon)
                      }}
                      onKeyDown={(e) => {
                        if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          setActiveCard(card.icon)
                        }
                      }}
                      className={`w-full flex flex-col overflow-hidden shrink-0 border border-[rgba(42,37,32,0.04)] will-change-transform transition-[background-color,border-color,box-shadow,opacity] duration-300 ease-out ${!isActive ? 'cursor-pointer hover:opacity-90' : ''}`}
                      style={{
                        background: isActive ? 'white' : card.bg,
                        borderRadius: MOBILE_CARD_RADIUS,
                        marginTop: i === 0 ? '0' : '-14px',
                        marginBottom: isActive ? '16px' : '0',
                        zIndex: isActive ? CARDS.length + 1 : CARDS.length - i,
                        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
                      }}
                      transition={reduceMotion ? { duration: 0 } : MOBILE_CARD_TRANSITION}
                    >
                        {/* Card Header (Visible in deck) */}
                        <motion.div
                          className="flex h-[72px] shrink-0 items-center justify-between px-6"
                          animate={{ backgroundColor: isActive ? 'var(--color-terracotta)' : 'rgba(0, 0, 0, 0)' }}
                          transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: SENDA_EASE }}
                        >
                          <div className="flex items-center gap-4">
                            <motion.div
                              animate={{ color: isActive ? '#fff' : 'var(--color-ink)' }}
                              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: SENDA_EASE }}
                            >
                              <Icon size={24} strokeWidth={2} />
                            </motion.div>
                            <motion.h3 
                              className="font-sans text-[16px] font-bold"
                              animate={{ color: isActive ? '#fff' : 'var(--color-ink)' }}
                              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: SENDA_EASE }}
                              style={{ margin: 0 }}
                            >
                              {card.title}
                            </motion.h3>
                          </div>
                          {isActive && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveCard(null) }}
                              aria-label="Fechar"
                              className="text-white hover:bg-[rgba(255,255,255,0.2)] p-2 rounded-full transition-colors"
                            >
                              <ArrowLeft size={20} strokeWidth={2.5} />
                            </button>
                          )}
                        </motion.div>

                        {/* Active Content */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={reduceMotion ? false : { height: 0, opacity: 0, y: -8 }}
                              animate={{ height: 'auto', opacity: 1, y: 0 }}
                              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: -6 }}
                              transition={
                                reduceMotion
                                  ? { duration: 0 }
                                  : { height: { duration: 0.32, ease: SENDA_EASE }, opacity: { duration: 0.24, ease: SENDA_EASE }, y: { duration: 0.28, ease: SENDA_EASE } }
                              }
                              className="flex flex-col overflow-hidden px-5 pb-8 pt-5"
                            >
                              {activeCard === 'users' ? (
                                <ExpandedParceiros onClose={() => setActiveCard(null)} isMobile />
                              ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-[var(--color-ink-sub)]">
                                    <p>Conteúdo de {card.title} em breve...</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay com Fundo Desfocado para o Modo Expandido (Apenas Desktop) */}
      <AnimatePresence>
        {isMobile === false && activeCard && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Detalhes do produto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, pointerEvents: 'auto' }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            className="fixed inset-0 z-[100] bg-[rgba(242,239,233,0.7)] backdrop-blur-md flex flex-col items-center justify-center p-12 overflow-hidden"
            onClick={() => setActiveCard(null)}
          >
            {/* Desktop View (Sidebar + Content) */}
            <div className="flex landing-max gap-8 h-full min-h-0 w-full items-stretch relative max-w-7xl mx-auto" onClick={(e) => e.stopPropagation()}>
              {/* Sidebar (Left) */}
              <div className="flex flex-col gap-4 w-[280px] shrink-0 pt-16">
                {CARDS.map((card) => {
                  const Icon = ICONS[card.icon]
                  const isActive = activeCard === card.icon

                  return (
                    <motion.button
                      key={card.icon}
                      onClick={() => setActiveCard(card.icon)}
                      className="flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[20px] py-8 px-4 text-center outline-none hover:scale-[1.02]"
                      style={{
                        background: isActive ? 'var(--color-terracotta)' : card.bg,
                        boxShadow: isActive ? '0 12px 32px rgba(42, 37, 32, 0.12)' : 'none',
                      }}
                    >
                      <motion.div
                        style={{
                          color: isActive ? 'white' : 'var(--color-ink)',
                        }}
                      >
                        <Icon size={32} strokeWidth={1.5} aria-hidden />
                      </motion.div>

                      <motion.div>
                        <motion.h3
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 15,
                            fontWeight: 700,
                            color: isActive ? 'white' : 'var(--color-ink)',
                            lineHeight: 1.2,
                          }}
                        >
                          {card.title}
                        </motion.h3>
                      </motion.div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Main Content (Right) */}
              <div className="flex-1 bg-[var(--color-cream)] rounded-[32px] p-10 flex flex-col shadow-xl border border-[rgba(42,37,32,0.06)] overflow-y-auto relative">
                {activeCard === 'users' ? (
                  <ExpandedParceiros onClose={() => setActiveCard(null)} />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-[var(--color-ink-sub)] relative"
                  >
                    <button
                      onClick={() => setActiveCard(null)}
                      className="absolute top-4 left-4 flex items-center gap-2 border-2 border-[var(--color-terracotta)] text-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] hover:text-white transition-colors px-5 py-2.5 rounded-full font-sans text-sm font-bold"
                    >
                      <ArrowLeft size={16} strokeWidth={2.5} />
                      Voltar aos produtos
                    </button>
                    <p>Conteúdo de {CARDS.find(c => c.icon === activeCard)?.title} em breve...</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
