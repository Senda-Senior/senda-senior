'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/design'

/**
 * CTA final — layout centralizado, 1 coluna, botões pill, título italic completo.
 * Substitui a versão 2-coluna com imagem e decorativos.
 */
export function CTAFinal() {
  return (
    <section
      id="contato"
      style={{
        background: 'var(--color-cream)',
        width: '100%',
        height: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 clamp(24px, 5vw, 80px)',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 720, width: '100%', margin: '0 auto' }}>

        {/* ── Título: italic, grande, centrado ── */}
        <Reveal>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(38px, 5.5vw, 64px)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: 'var(--color-ink)',
              marginBottom: 28,
              textWrap: 'balance',
            }}
          >
            Você não precisa percorrer esse caminho sozinho.
          </h2>
        </Reveal>

        {/* ── Subtítulo: pequeno, centrado, muted ── */}
        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(14.95px, 1.265vw, 17.25px)',
              lineHeight: 1.65,
              color: 'var(--color-ink-55)',
              marginBottom: 44,
            }}
          >
            Todo caminho começa com o primeiro passo. O seu começa aqui.
          </p>
        </Reveal>

        {/* ── Botões: centrados, pill ── */}
        <Reveal delay={0.18}>
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Primário: terracotta sólido — TODO: replace href with real WhatsApp number */}
            <Link
              href="https://wa.me/"
              id="cta-falar-senda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--color-terracotta)',
                color: 'white',
                padding: '14px 30px',
                borderRadius: 100,
                fontSize: 17.25,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.01em',
                transition: 'opacity 0.2s, transform 0.15s',
              }}
            >
              Falar com a Senda <ArrowRight size={15} strokeWidth={2} />
            </Link>

            {/* Secundário: outline ink */}
            <Link
              href="#metodologia"
              id="cta-conhecer-etapas"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                color: 'var(--color-ink)',
                padding: '13px 28px',
                borderRadius: 100,
                border: '1.5px solid var(--color-ink-35)',
                fontSize: 17.25,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.01em',
                transition: 'border-color 0.2s, opacity 0.2s',
              }}
            >
              Conhecer os 3 momentos
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
