/**
 * PorQuemViveu.tsx
 * Seção SOBRE / FUNDADORAS — header com stagger Reveal + cards alternados (foto + bio + credentials).
 *
 * ALERTA ARMADILHA DE NOMES (id vs conteúdo): apesar do nome "PorQuemViveu", o id desta seção é
 *    `#sobre` (label "Sobre" no menu) e TODOS os seletores de CSS desta seção usam `#sobre`.
 *    O id `#por-quem-viveu` pertence ao componente FundadorasStrip (serviços). Os ids batem
 *    com o HEADING de cada seção, não com o nome do componente. Não troque os ids.
 *
 * Conecta: FOUNDERS, FOUNDER_PHOTOS de @/features/landing/data/por-quem-viveu | motion de framer-motion
 * Camada: browser
 */
'use client'

import { motion } from 'framer-motion'
import NextImage from 'next/image'
import { useEffect, useState } from 'react'

import { FOUNDERS, FOUNDER_PHOTOS, type Founder } from '@/features/landing/data/por-quem-viveu'

/* ─── Animation variants ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
}

/* ─── Founder card ──────────────────────────────────────────────────── */

function FounderCard({ name, role, bio, credentials, reverse }: Founder) {
  const photo = FOUNDER_PHOTOS[name]
  const bioParagraphs = bio.split('\n\n')
  return (
    <motion.div
      variants={fadeUp}
      style={{
        display: 'grid',
        gridTemplateColumns: reverse ? '55fr 45fr' : '45fr 55fr',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'var(--color-gold-beige)',
        minHeight: 'clamp(240px, 30vh, 320px)',
      }}
    >
      {!reverse && (
        <div
          className="founder-photo-col"
          style={{ position: 'relative', minHeight: 240, background: 'var(--color-gold-beige)' }}
        >
          <NextImage
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="founder-photo-img"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      )}

      {/* Text */}
      <div
        style={{
          padding: 'clamp(28px, 4vw, 44px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <div
          style={{
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {bioParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(15.5px, 1.3vw, 18.4px)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'var(--color-ink)',
                margin: 0,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 17.25,
            fontWeight: 600,
            color: 'var(--color-terracotta)',
            marginBottom: 3,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14.95,
            color: 'var(--color-ink-45)',
          }}
        >
          {role}
        </p>
        {credentials?.length ? (
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid rgba(42, 37, 32, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-45)',
                margin: 0,
              }}
            >
              Formação
            </p>
            {credentials.map((item) => (
              <p
                key={item}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13.8,
                  lineHeight: 1.55,
                  color: 'var(--color-ink-58)',
                  margin: 0,
                }}
              >
                {item}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      {reverse && (
        <div
          className="founder-photo-col"
          style={{ position: 'relative', minHeight: 240, background: 'var(--color-gold-beige)' }}
        >
          <NextImage
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="founder-photo-img"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      )}
    </motion.div>
  )
}

/* ─── Component ─────────────────────────────────────────────────────── */

export function PorQuemViveu() {
  const [canAnimateInView, setCanAnimateInView] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanAnimateInView('IntersectionObserver' in window)
  }, [])

  return (
    // id `#sobre` = seção SOBRE/FUNDADORAS (menu "Sobre"). Os serviços ficam em
    // FundadorasStrip / `#por-quem-viveu`. Ver "ARMADILHA DE NOMES" no topo do arquivo.
    <section
      id="sobre"
      style={{
        background: 'var(--color-cream)',
        width: '100%',
        padding: 'clamp(60px, 8vw, 96px) clamp(24px, 6vw, 80px)',
      }}
    >
      {/* maxWidth: 860 — matches reference column width */}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── Header — fade+rise stagger ── */}
        <motion.div
          variants={stagger}
          initial={canAnimateInView ? 'hidden' : false}
          animate={canAnimateInView ? undefined : 'show'}
          whileInView={canAnimateInView ? 'show' : undefined}
          viewport={canAnimateInView ? { once: true, margin: '-8%' } : undefined}
          style={{
            marginBottom: 'clamp(32px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12.65,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-terracotta)',
            }}
          >
            Sobre nós
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              textWrap: 'balance',
            }}
          >
            Aqui, ninguém fala de cuidado sem tê-lo vivido.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16.1px, 1.3225vw, 18.4px)',
              lineHeight: 1.7,
              color: 'var(--color-ink-58)',
              maxWidth: 480,
            }}
          >
            A Senda Sênior é uma empresa de planejamento e assessoria para o
            envelhecimento familiar. Fundada por Julianne e Luciana, duas
            mulheres que viveram pessoalmente os desafios de cuidar de mães
            idosas, oferecemos orientação estruturada para famílias em qualquer
            fase do cuidado.
          </motion.p>
        </motion.div>

        {/* ── Founder cards ── */}
        <motion.div
          variants={stagger}
          initial={canAnimateInView ? 'hidden' : false}
          animate={canAnimateInView ? undefined : 'show'}
          whileInView={canAnimateInView ? 'show' : undefined}
          viewport={canAnimateInView ? { once: true, margin: '-5%' } : undefined}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
