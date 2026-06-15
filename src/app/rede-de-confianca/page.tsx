import Link from 'next/link'
import NextImage from 'next/image'
import { Users, UserCheck, Stethoscope, ShieldCheck, ArrowLeft } from 'lucide-react'
import { requireUser, getProfile } from '@/lib/server'
import { LogoutButton } from '@/features/dashboard/components/LogoutButton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Rede de Confiança | Senda Sênior',
}

const TIPOS = [
  {
    icon: <Users size={22} strokeWidth={1.5} />,
    label: 'Família',
    desc: 'Filhos, cônjuge, irmãos — pessoas que participam ativamente do cuidado.',
  },
  {
    icon: <UserCheck size={22} strokeWidth={1.5} />,
    label: 'Cuidadores',
    desc: 'Cuidadores formais ou informais com acesso controlado às informações.',
  },
  {
    icon: <Stethoscope size={22} strokeWidth={1.5} />,
    label: 'Profissionais de saúde',
    desc: 'Médico de referência, fisioterapeuta, nutricionista e outros especialistas.',
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={1.5} />,
    label: 'Responsáveis legais',
    desc: 'Quem tem procuração ou é responsável por decisões jurídicas e financeiras.',
  },
]

export default async function RedeDeConfiancaPage() {
  const user = await requireUser()
  const profile = await getProfile(user)

  const displayName = profile.displayName ?? user.email?.split('@')[0] ?? 'Usuário'
  const userInitial = displayName[0]?.toUpperCase() ?? 'U'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <header
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 40px)' }}>
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
          <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Link href="/dashboard" style={{ fontSize: 17.25, fontWeight: 500, color: 'var(--color-ink-sub)', textDecoration: 'none' }}>
              Painel
            </Link>
            <span style={{ fontSize: 17.25, fontWeight: 700, color: 'var(--color-green-dark)' }}>
              Rede de Confiança
            </span>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 14px',
              borderRadius: 10,
              background: 'rgba(45,95,79,0.06)',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--color-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14.95,
                fontWeight: 700,
                color: 'white',
              }}
            >
              {userInitial}
            </div>
            <span style={{ fontSize: 16.1, fontWeight: 500, color: 'var(--color-ink-sub)' }}>
              {displayName}
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main
        style={{
          maxWidth: 780,
          margin: '0 auto',
          padding: 'clamp(36px, 5vw, 64px) clamp(20px, 4vw, 48px) 80px',
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14.5,
            fontWeight: 500,
            color: 'var(--color-ink-sub)',
            textDecoration: 'none',
            marginBottom: 36,
          }}
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Voltar ao painel
        </Link>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-terracotta)',
            marginBottom: 10,
          }}
        >
          Em breve
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--color-ink)',
            lineHeight: 1.12,
            marginBottom: 16,
          }}
        >
          Rede de Confiança
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 1.5vw, 18.5px)',
            color: 'var(--color-ink-sub)',
            lineHeight: 1.65,
            maxWidth: 560,
            marginBottom: 40,
          }}
        >
          Aqui você vai cadastrar e organizar todas as pessoas envolvidas no cuidado — com controle preciso sobre quem acessa quais informações.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {TIPOS.map((tipo) => (
            <div
              key={tipo.label}
              style={{
                padding: '20px 22px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(45, 61, 45, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ color: 'var(--color-green)', opacity: 0.8 }}>{tipo.icon}</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
                {tipo.label}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13.8, color: 'var(--color-ink-sub)', lineHeight: 1.55, margin: 0 }}>
                {tipo.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '20px 24px',
            borderRadius: 14,
            background: 'rgba(45,95,79,0.06)',
            border: '1px solid rgba(45,95,79,0.12)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--color-ink-sub)', lineHeight: 1.65, margin: 0 }}>
            Você decide quem vê o quê. Um cuidador pode ter acesso à lista de medicamentos sem ver os documentos jurídicos. Um familiar distante pode ser notificado sem ter acesso ao cofre.
          </p>
        </div>
      </main>
    </div>
  )
}
