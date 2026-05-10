'use client'

import NextImage from 'next/image'
import { Phone } from 'lucide-react'
import { Reveal } from '@/design'
import { StarCluster } from '@/features/landing/shared/BrandStar'
import { SCurveDecoration } from '@/features/landing/shared/BrandDecorative'
import { SERVICOS } from '@/features/landing/data/servicos'

export function Servicos() {
  return (
    <section id="servicos" style={{
      padding: 'clamp(100px, 12vw, 180px) clamp(20px, 4vw, 60px)',
      background: 'var(--color-cream-mid)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Padrão caminho sutil — design folder */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: "url('/brand/pattern-caminho-greenmono-claro.png')",
          backgroundSize: '900px auto',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
        }}
      />

      {/* S-curve decoration */}
      <div style={{ position: 'absolute', bottom: '5%', left: '-10%', width: 'clamp(400px, 60vw, 800px)', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }}>
        <SCurveDecoration color="var(--color-green)" />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <StarCluster size={24} style={{ opacity: 0.5 }} />
            <p className="label-premium">Além do manual</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 4.5vw, 56px)',
            fontWeight: 500, lineHeight: 1.1, color: 'var(--color-ink)',
            marginBottom: 'clamp(60px, 8vw, 100px)', letterSpacing: '-0.02em', maxWidth: 560,
          }}>
            Serviços para quem quer ir além.
          </h2>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {SERVICOS.map((s, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div style={{
                padding: 'clamp(36px, 5vw, 56px) 0',
                borderTop: '1px solid rgba(42,37,32,0.08)',
                display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(24px, 3vw, 40px)',
                alignItems: 'start',
              }} className="grid-pillar">
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(74,94,74,0.08)',
                  marginTop: 6,
                }}>
                  <NextImage src={s.iconSrc} alt="" width={24} height={24} style={{ opacity: 0.8 }} />
                </span>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 2.8vw, 32px)', fontWeight: 500,
                    color: 'var(--color-ink)', marginBottom: 12, lineHeight: 1.2,
                  }}>{s.titulo}</h3>
                  <p style={{
                    fontSize: 'clamp(19.55px, 2.07vw, 23px)', lineHeight: 1.7, color: 'var(--color-ink-sub)',
                    fontWeight: 400, maxWidth: 520,
                  }}>{s.descricao}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div style={{ textAlign: 'center', marginTop: 'clamp(48px, 6vw, 80px)' }}>
            <a href="#contato" id="servicos-cta" className="btn-outline-terracotta-hover" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              border: '1.5px solid var(--color-terracotta)', color: 'var(--color-terracotta)',
              padding: '16px 36px', borderRadius: 8,
              fontSize: 18.4, fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.3s',
            }}>
              <Phone size={16} strokeWidth={2} />
              Entre em contato
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
