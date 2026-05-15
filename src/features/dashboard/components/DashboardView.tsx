'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Scale,
  Heart,
  ShieldCheck,
  FolderOpen,
  Stethoscope,
  UserPlus,
  Lock,
  Shield,
} from 'lucide-react'
import { ErrorBoundary } from '@/design'
import { Checklist } from './Checklist'
import { LogoutButton } from './LogoutButton'
import type { ChecklistItem } from '@/features/dashboard/types'

interface Pilar {
  icon: ReactNode
  label: string
  title: string
  desc: string
  color: string
  bg: string
}

const PILARES: Pilar[] = [
  {
    icon: <Scale size={28} strokeWidth={1.5} />,
    label: 'Jurídico',
    title: 'Documentos e Procurações',
    desc: 'Testamento, diretivas antecipadas e procurações organizadas e seguras.',
    color: 'var(--color-green)',
    bg: 'linear-gradient(135deg, #E8F0EB 0%, #D4E5DB 100%)',
  },
  {
    icon: <Heart size={28} strokeWidth={1.5} />,
    label: 'Saúde',
    title: 'Histórico Médico',
    desc: 'Exames, medicamentos e médicos centralizados — para você e quem você ama.',
    color: 'var(--color-terracotta)',
    bg: 'linear-gradient(135deg, #F5EFE6 0%, #EDE5D8 100%)',
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    label: 'Proteção',
    title: 'Rede de Confiança',
    desc: 'Família, cuidadores e profissionais — com acesso controlado por você.',
    color: 'var(--color-green)',
    bg: 'linear-gradient(135deg, #F0F5F2 0%, #E0EBE5 100%)',
  },
]

const ACOES: Array<{ icon: ReactNode; title: string; desc: string; href?: string }> = [
  { icon: <FolderOpen size={22} strokeWidth={1.5} />, title: 'Abrir cofre', desc: 'Seus documentos organizados automaticamente', href: '/vault' },
  { icon: <Stethoscope size={22} strokeWidth={1.5} />, title: 'Registrar consulta', desc: 'Adicionar exame ou consulta' },
  { icon: <UserPlus size={22} strokeWidth={1.5} />, title: 'Convidar pessoa', desc: 'Adicionar à rede de confiança' },
  { icon: <Lock size={22} strokeWidth={1.5} />, title: 'Configurar acessos', desc: 'Gerenciar permissões' },
]

interface DashboardViewProps {
  userEmail: string
  firstName: string
  initialChecklist: ChecklistItem[]
}

export function DashboardView({ userEmail, firstName, initialChecklist }: DashboardViewProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredAction, setHoveredAction] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--color-cream)' }}>
      {/* Luz suave no fundo creme */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 100% 80% at 0% 0%, rgba(245,240,232,0.95) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(234,227,212,0.5) 0%, transparent 50%)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      <header
        className="dash-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0 clamp(20px, 4vw, 48px)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(245,239,230,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(45, 61, 45, 0.1)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', lineHeight: 0 }}>
          <NextImage
            src="/brand/logo-wordmark-dark.png"
            alt="Senda Sênior"
            width={220}
            height={64}
            style={{ height: 36, width: 'auto' }}
            priority
          />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 16px',
              borderRadius: 10,
              background: 'rgba(45,95,79,0.06)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16.1,
                fontWeight: 700,
                color: 'white',
              }}
            >
              {firstName[0]?.toUpperCase()}
            </div>
            <span
              className="dash-header-email"
              style={{
                fontSize: 17.25,
                fontWeight: 500,
                color: 'var(--color-ink-sub)',
              }}
            >
              {userEmail}
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 'clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px)',
        }}
      >
        <ErrorBoundary>
          <section
            className="dashboard-hero"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
              gap: 'clamp(24px, 4vw, 40px)',
              alignItems: 'center',
              marginBottom: 48,
              padding: 'clamp(24px, 3.5vw, 40px)',
              borderRadius: 20,
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.88) 0%, var(--color-cream) 100%)',
              border: '1px solid rgba(45, 61, 45, 0.1)',
              boxShadow: '0 24px 64px rgba(42, 37, 32, 0.08), 0 0 0 1px rgba(255,255,255,0.5) inset',
            }}
          >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-15%',
              width: '50%',
              height: '80%',
              opacity: 0.12,
              background: 'radial-gradient(circle, rgba(181, 114, 74, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 18,
                flexWrap: 'wrap',
              }}
            >
              <NextImage
                src="/brand/star-scatter-decoration.jpg"
                alt=""
                width={120}
                height={120}
                style={{ width: 52, height: 'auto', opacity: 0.9 }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14.95,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-terracotta)',
                  margin: 0,
                }}
              >
                Painel
              </p>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(30px, 3.6vw, 44px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                marginBottom: 12,
                lineHeight: 1.15,
              }}
            >
              Olá, {firstName}.
            </h1>
            <p
              style={{
                fontSize: 'clamp(16px, 1.4vw, 18px)',
                color: 'var(--color-ink-sub)',
                lineHeight: 1.65,
                fontWeight: 500,
                maxWidth: 420,
                marginBottom: 20,
              }}
            >
              Continue organizando o que importa. Tudo sob seu controle.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 17.25,
                fontWeight: 600,
                color: 'var(--color-green)',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor',
                paddingBottom: 2,
              }}
            >
              Ir para o site
            </Link>
          </div>
          <div
            className="dashboard-hero-image"
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: 16,
              overflow: 'hidden',
              minHeight: 200,
            }}
          >
            <NextImage
              src="/brand/photos/prancheta-7.png"
              alt=""
              fill
              sizes="(max-width: 900px) 90vw, 400px"
              style={{
                objectFit: 'cover',
                objectPosition: '22% 40%',
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(245,240,232,0.5) 0%, transparent 35%), linear-gradient(0deg, rgba(32, 38, 30, 0.2) 0%, transparent 45%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </section>

        <div
          className="grid-pillar"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 56,
          }}
        >
          {PILARES.map((p, i) => (
            <div
              key={p.label}
              id={`card-${p.label.toLowerCase()}`}
              style={{
                padding: 32,
                borderRadius: 16,
                background: p.bg,
                border: '1px solid rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.4s var(--ease-senda)',
                transform: hoveredCard === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow:
                  hoveredCard === i
                    ? '0 16px 48px rgba(0,0,0,0.1)'
                    : '0 2px 12px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={{ display: 'block', fontSize: 32, marginBottom: 20, opacity: 0.7 }}>
                {p.icon}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12.65,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: p.color,
                  marginBottom: 8,
                  opacity: 0.6,
                }}
              >
                {p.label}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 17.25,
                  lineHeight: 1.6,
                  color: 'var(--color-ink-sub)',
                  fontWeight: 500,
                }}
              >
                {p.desc}
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 17.25,
                  fontWeight: 600,
                  color: p.color,
                }}
              >
                Acessar
                <span
                  style={{
                    transition: 'transform 0.3s',
                    transform: hoveredCard === i ? 'translateX(4px)' : 'translateX(0)',
                    display: 'inline-block',
                  }}
                >
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 22,
              fontWeight: 600,
              color: 'var(--color-ink)',
              marginBottom: 24,
              letterSpacing: '-0.01em',
            }}
          >
            Ações rápidas
          </h2>
          <div
            className="grid-actions"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          >
            {ACOES.map((a, i) => {
              const inner = (
                <>
                  <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{a.icon}</span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 17.25,
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      marginBottom: 4,
                    }}
                  >
                    {a.title}
                  </p>
                  <p
                    style={{
                      fontSize: 16.1,
                      color: 'var(--color-ink-muted)',
                      lineHeight: 1.4,
                      fontWeight: 500,
                    }}
                  >
                    {a.desc}
                  </p>
                </>
              )

              const boxStyle: CSSProperties = {
                padding: '20px 24px',
                borderRadius: 14,
                background:
                  hoveredAction === i ? 'var(--color-cream)' : 'rgba(254,252,249,0.6)',
                border: '1.5px solid',
                borderColor:
                  hoveredAction === i ? 'var(--color-green-light)' : 'rgba(0,0,0,0.04)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s',
                transform: hoveredAction === i ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hoveredAction === i ? '0 8px 24px rgba(0,0,0,0.06)' : 'none',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
              }

              if (a.href) {
                return (
                  <Link
                    key={a.title}
                    href={a.href}
                    id={`action-${i}`}
                    style={boxStyle}
                    onMouseEnter={() => setHoveredAction(i)}
                    onMouseLeave={() => setHoveredAction(null)}
                  >
                    {inner}
                  </Link>
                )
              }
              return (
                <button
                  key={a.title}
                  id={`action-${i}`}
                  style={boxStyle}
                  onMouseEnter={() => setHoveredAction(i)}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  {inner}
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="grid-status"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
        >
          <div
            style={{
              padding: 32,
              borderRadius: 16,
              background: 'var(--color-cream)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--color-green-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                <Shield size={20} strokeWidth={1.8} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                }}
              >
                Segurança
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Criptografia', status: 'Ativa', ok: true },
                { label: 'Autenticação', status: 'Verificada', ok: true },
                { label: 'LGPD', status: 'Em conformidade', ok: true },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(45,95,79,0.03)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 17.25,
                      color: 'var(--color-ink-sub)',
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: 16.1,
                      fontWeight: 600,
                      color: item.ok ? 'var(--color-green)' : 'var(--color-terracotta)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: item.ok ? '#22C55E' : '#EAB308',
                        display: 'inline-block',
                      }}
                    />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

            <Checklist initialItems={initialChecklist} />
          </div>
        </ErrorBoundary>
      </main>

      <footer
        style={{
          padding: '32px clamp(20px, 4vw, 48px)',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 14.95, color: 'var(--color-ink-muted)' }}>
          © 2026 Senda Sênior. Seus dados estão protegidos por criptografia ponta a ponta.
        </p>
      </footer>
      </div>
    </div>
  )
}
