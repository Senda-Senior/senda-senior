'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { Reveal } from '@/design'
import { ArrowRight } from 'lucide-react'

export function Manifesto() {
  return (
    <section
      id="manifesto-verde"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--color-green-dark)', // Fundo esticado até a borda esquerda
        overflow: 'hidden',
        minHeight: 'clamp(600px, 55vw, 1000px)', // Força a seção a crescer proporcionalmente à largura da tela
      }}
    >
      {/* Lado Esquerdo: Bloco Verde com Texto (6 colunas) */}
      <div
        style={{
          position: 'relative',
          padding: 'clamp(64px, 8vw, 120px) clamp(20px, 4vw, 100px)', // Respeitando a margem do grid
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
          <Reveal>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-light)',
                marginBottom: 24,
              }}
            >
              O briefing da vida real
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(36px, 4.5vw, 64px)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--color-cream)',
                marginBottom: 40,
              }}
            >
              Ninguém nos<br />
              ensina a cuidar<br />
              de pais que<br />
              envelhecem.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(15.5px, 1.35vw, 17px)',
                lineHeight: 1.75,
                color: 'var(--color-cream-85)',
                maxWidth: 460,
                marginBottom: 52,
              }}
            >
              A maioria das famílias só procura ajuda depois da primeira crise: uma queda, uma internação, um diagnóstico inesperado.<br /><br />
              Mas existe outra forma de atravessar esse caminho.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <Link
              href="#sobre"
              className="btn-terracotta-hover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: 'var(--color-terracotta)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: 40, // Pill shape
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Entenda como funciona
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Lado Direito: Foto Mãe e Filha (6 colunas) */}
      <div
        style={{
          position: 'relative',
          minHeight: '100%',
          boxShadow: 'var(--shadow-inset-separator)', // Sombra para separar o verde da foto
        }}
      >
        {/* Usando <img> direto — Next.js não otimiza SVG, fill replicado via position absolute */}
        <img
          src="/brand/photos/mae_filha.svg"
          alt="Mãe e filha sorrindo"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />
      </div>
    </section>
  )
}
