'use client'

/* eslint-disable @next/next/no-img-element */

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

/* ─── Data ──────────────────────────────────────────────────────────── */

const FASES = [
  {
    index: 0,
    num: '01',
    fase: 'FASE 1',
    title: 'Prevent Care',
    subtitle: 'Seus pais ainda são autônomos.',
    desc: 'É hora de planejar — não de esperar.',
    tagline: 'Prevenir é o maior cuidado.',
    bg: '#e8ede4',
    bgExpanded: '#dde5d8',
    numColor: 'var(--color-green)',
    titleColor: 'var(--color-ink)',
    accentColor: 'var(--color-green-dark)',
    checkColor: 'var(--color-green)',
    // Brand icon: shield-check — prevention/protection — white on dark-green bg
    iconSrc: '/icons/brand/shield-check.svg',
    iconFilter: 'brightness(0) invert(1)',
    checklist: [
      'Avaliar autonomia e saúde atual dos pais',
      'Organizar documentos essenciais',
      'Abrir conversas sobre o futuro',
      'Avaliar a segurança do ambiente',
      'Prever gastos futuros',
    ],
  },
  {
    index: 1,
    num: '02',
    fase: 'FASE 2',
    title: 'Care',
    subtitle: 'Os primeiros sinais apareceram.',
    desc: 'É hora de começar a agir — não de improvisar.',
    tagline: 'Organizar é forma de amor.',
    bg: '#d9c9a8',
    bgExpanded: '#cfc09a',
    numColor: 'var(--color-terracotta)',
    titleColor: 'var(--color-ink)',
    accentColor: 'var(--color-terracotta)',
    checkColor: 'var(--color-terracotta)',
    // Brand icon: heart — care/compassion — white on terracotta bg
    iconSrc: '/icons/brand/heart.svg',
    iconFilter: 'brightness(0) invert(1)',
    checklist: [
      'Consulta médica ao Geriatra',
      'Adaptar o ambiente doméstico',
      'Organizar rotinas',
      'Dividir responsabilidades familiares',
      'O papel do cuidador principal',
      'Gerir profissionais',
    ],
  },
  {
    index: 2,
    num: '03',
    fase: 'FASE 3',
    title: 'Immediate Care',
    subtitle: 'Necessidades urgentes.',
    desc: 'Idosos que requerem supervisão constante.',
    tagline: 'Na urgência, clareza salva.',
    bg: '#c98a65',
    bgExpanded: '#b5724a',
    numColor: 'var(--color-cream)',
    titleColor: 'var(--color-cream)',
    accentColor: 'var(--color-cream)',
    checkColor: 'var(--color-cream)',
    // Brand icon: life-ring — rescue/urgent — dark ink on cream bg
    iconSrc: '/icons/brand/life-ring.svg',
    iconFilter: 'none',
    checklist: [
      'Entender e aceitar que o momento é de vigilância 24h',
      'Organizar rotinas',
      'Adaptar ambientes',
      'O papel do cuidador principal e o risco de colapso',
      'Gestão financeira',
      'Gestão de equipe',
      'Decisões difíceis',
    ],
  },
]

/* ─── Expandable Card ──────────────────────────────────────────────── */

function FaseCard({
  fase,
  isExpanded,
  onToggle,
}: {
  fase: typeof FASES[0]
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      layout
      style={{
        background: isExpanded ? fase.bgExpanded : fase.bg,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: isExpanded
          ? '0 32px 80px rgba(0,0,0,0.18)'
          : '0 8px 32px rgba(0,0,0,0.08)',
        cursor: 'default',
        width: '100%',
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* ── Header (always visible) ── */}
      <motion.div layout="position" style={{ padding: '36px 36px 0' }}>
        {/* Brand icon mark — 32×32 container, 18px icon, filter per accentColor darkness */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: fase.accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            flexShrink: 0,
          }}
        >
          <img
            src={fase.iconSrc}
            width={18}
            height={18}
            alt=""
            aria-hidden
            style={{ filter: fase.iconFilter }}
          />
        </div>

        {/* Title */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(22px, 2.2vw, 30px)',
            fontWeight: 500,
            color: fase.titleColor,
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}
        >
          {fase.title}
        </p>

        {/* Big number */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(56px, 8vw, 100px)',
            fontWeight: 400,
            lineHeight: 1,
            color: fase.numColor,
            opacity: 0.2,
            letterSpacing: '-0.04em',
            marginBottom: 12,
            userSelect: 'none',
          }}
        >
          {fase.num}
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(13px, 1.1vw, 14px)',
            color: fase.titleColor,
            opacity: 0.75,
            lineHeight: 1.5,
            marginBottom: 28,
          }}
        >
          {fase.subtitle}<br />
          <strong style={{ opacity: 1, fontWeight: 600 }}>{fase.desc}</strong>
        </p>
      </motion.div>

      {/* ── Checklist (animated) ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 36px' }}>
              <div
                style={{
                  width: '100%',
                  height: 1,
                  background: fase.titleColor,
                  opacity: 0.15,
                  marginBottom: 24,
                }}
              />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {fase.checklist.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(14.95px, 1.265vw, 16.1px)',
                      color: fase.titleColor,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: `1.5px solid ${fase.checkColor}`,
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 1,
                        opacity: 0.9,
                      }}
                    >
                      <Check size={11} color={fase.checkColor} strokeWidth={2.5} />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>

              {/* Tagline */}
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(16.1px, 1.265vw, 17.25px)',
                  fontStyle: 'italic',
                  color: fase.titleColor,
                  opacity: 0.65,
                  marginTop: 24,
                  paddingBottom: 4,
                }}
              >
                &quot;{fase.tagline}&quot;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer / Toggle ── */}
      <motion.div layout="position" style={{ padding: '20px 36px 32px' }}>
        <button
          onClick={onToggle}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            color: fase.accentColor,
            fontSize: 16.1,
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            opacity: 0.85,
            letterSpacing: '0.02em',
            padding: 0,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
        >
          {isExpanded ? (
            <>Fechar checklist <ChevronUp size={14} strokeWidth={2} /></>
          ) : (
            <>Ver checklist <ChevronDown size={14} strokeWidth={2} /></>
          )}
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ─── Desktop: sticky scroll carousel ──────────────────────────────── */

export function DesktopManualSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const railContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Measure the card viewport width for pixel-accurate rail translation
  useEffect(() => {
    const el = railContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  // ── One-step-at-a-time switching ─────────────────────────────────
  // activeIndexRef mirrors state so the event listener always reads the
  // freshest value (avoids React closure staleness). Advancing one step
  // per threshold crossing prevents skipping card 2 on fast scrolls.
  const activeIndexRef = useRef(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const rawNext = v < 0.33 ? 0 : v < 0.67 ? 1 : 2
    const cur = activeIndexRef.current
    if (rawNext === cur) return

    const step = rawNext > cur ? cur + 1 : cur - 1
    const clamped = Math.max(0, Math.min(2, step))
    if (clamped === cur) return

    activeIndexRef.current = clamped
    setActiveIndex(clamped)
    setExpandedIndex(null)
  })

  // Rail offset: slide left by one card-width per step
  const railX = -activeIndex * (containerWidth + 16) // +16 = gap between cards

  return (
    <section
      id="manual"
      ref={trackRef}
      style={{ height: '250vh', position: 'relative' }}
    >
      {/* ── Sticky viewport ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--color-green-dark)',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: 0.08,
            backgroundImage: "url('/brand/pattern-estrela-greenmono-dark.png')",
            backgroundSize: '600px auto',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />

        {/* ── Inner grid ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(40px, 5vw, 80px) clamp(20px, 4vw, 60px)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px, 5vw, 80px)',
            alignItems: 'center',
          }}
          className="grid-pillar"
        >
          {/* ── Left: Editorial text (static) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12.65,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-light)',
                marginBottom: 24,
                opacity: 0.85,
              }}
            >
              Metodologia Senda Sênior
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(42px, 5.5vw, 72px)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                color: 'var(--color-cream)',
                marginBottom: 32,
                textWrap: 'balance',
              }}
            >
              Os 3 momentos<br />
              do cuidado.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(16.1px, 1.38vw, 18.4px)',
                lineHeight: 1.65,
                color: 'rgba(245,240,232,0.75)',
                maxWidth: 440,
                marginBottom: 24,
              }}
            >
<<<<<<< Updated upstream
              A Senda Sênior é uma empresa de planejamento e assessoria para o envelhecimento familiar. Fundada por Luciana e Julianne — duas mulheres que viveram pessoalmente os desafios de cuidar de mães idosas — oferecemos orientação estruturada para famílias em qualquer fase do cuidado.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(16.1px, 1.265vw, 17.25px)',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'rgba(245,240,232,0.9)',
                marginBottom: 40,
                maxWidth: 400,
              }}
            >
              Não somos cuidadores. Não somos clínica.<br />
              Somos a bússola que orienta o caminho.
=======
              Estruturamos o envelhecimento em três estágios para ajudar você a entender o presente e proteger o futuro. Esta classificação não rotula; ela orienta.
>>>>>>> Stashed changes
            </p>

            <Link
              href="#contato"
              className="btn-terracotta-hover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--color-terracotta)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: 30,
                fontSize: 16.1,
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                textDecoration: 'none',
                alignSelf: 'flex-start',
                transition: 'all 0.3s',
              }}
            >
              Ver manuais <ArrowRight size={16} strokeWidth={2} />
            </Link>

            {/* Scroll progress dots */}
            <div style={{ display: 'flex', gap: 8, marginTop: 48 }}>
              {FASES.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: activeIndex === i ? 28 : 8,
                    background: activeIndex === i
                      ? 'var(--color-gold-light)'
                      : 'rgba(245,240,232,0.25)',
                  }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  style={{ height: 8, borderRadius: 4 }}
                />
              ))}
            </div>
          </div>

          {/* ── Right: Physical rail — all 3 cards side-by-side, slides as one unit ── */}
          <div
            ref={railContainerRef}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 24,
              isolation: 'isolate',
            }}
          >
            {/*
              Rail: flex row with 3 full-width cards.
              containerWidth is measured via ResizeObserver so px math is exact.
              Spring animates the entire rail left — cards glide together as a
              physical conveyor belt, no teleportation, no unmounting.
            */}
            <motion.div
              animate={{ x: railX }}
              transition={{
                type: 'spring',
                stiffness: 70,
                damping: 22,
                mass: 0.85,
              }}
              style={{
                display: 'flex',
                gap: 16,
                // Total rail width: 3 cards + 2 gaps
                width: containerWidth
                  ? containerWidth * 3 + 32
                  : '300%',
              }}
            >
              {FASES.map((fase, i) => (
                <div
                  key={i}
                  style={{
                    flex: `0 0 ${containerWidth || 300}px`,
                    minWidth: 0,
                  }}
                >
                  <FaseCard
                    fase={fase}
                    isExpanded={expandedIndex === i}
                    onToggle={() =>
                      setExpandedIndex(prev => (prev === i ? null : i))
                    }
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Mobile: stacked cards (no sticky scroll) ─────────────────────── */

function MobileManualSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section
      id="manual"
      style={{
        background: 'var(--color-green-dark)',
        padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 40px)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-light)',
            marginBottom: 16,
            opacity: 0.85,
          }}
        >
          Metodologia Senda Sênior
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(38px, 10vw, 56px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--color-cream)',
            textWrap: 'balance',
            marginBottom: 20,
          }}
        >
          Os 3 momentos<br />do cuidado.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 17.25,
            lineHeight: 1.65,
            color: 'rgba(245,240,232,0.7)',
          }}
        >
          Estruturamos o envelhecimento em três estágios para ajudar você a entender o presente e proteger o futuro. Esta classificação não rotula; ela orienta.
        </p>
      </div>

      {/* Stacked cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FASES.map((fase, i) => (
          <FaseCard
            key={i}
            fase={fase}
            isExpanded={expandedIndex === i}
            onToggle={() => setExpandedIndex(prev => (prev === i ? null : i))}
          />
        ))}
      </div>
    </section>
  )
}

/* ─── Exported section: picks desktop or mobile ─────────────────────── */

export function ManualSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isMobile) return <MobileManualSection />
  return <DesktopManualSection />
}
