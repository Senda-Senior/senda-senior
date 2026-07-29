import { Users, UserCheck, Stethoscope, ShieldCheck } from 'lucide-react'
import { requireUser, getProfile } from '@/lib/server'
import { canAccessAssessoria } from '@/features/assessoria/access'
import { AppShell } from '@/features/dashboard/components/AppShell'

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
  const firstName = displayName.split(' ')[0] || 'Usuário'

  return (
    <AppShell
      firstName={firstName}
      displayName={displayName}
      avatarUrl={profile.avatarUrl}
      showEquipeNav={await canAccessAssessoria(user)}
      pageTitle="Rede de Confiança"
      pageSubtitle="Gerencie quem acessa quais informações."
    >
      <div className="flex min-h-full flex-col justify-center px-5 py-8 lg:px-8 lg:py-10">
        <div className="max-w-[720px]">
          <p className="mb-3 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
            Em breve
          </p>
          <h1 className="mb-4 font-serif text-[clamp(26px,3.2vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
            Rede de Confiança
          </h1>
          <p className="mb-10 max-w-[540px] font-sans text-[15.5px] leading-[1.65] text-[var(--color-ink-sub)]">
            Aqui você vai cadastrar e organizar todas as pessoas envolvidas no cuidado — com controle preciso sobre quem acessa quais informações.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TIPOS.map((tipo) => (
              <div
                key={tipo.label}
                className="rounded-[16px] border border-[rgba(42,37,32,0.07)] bg-white p-5 shadow-[0_2px_12px_rgba(42,37,32,0.04)]"
              >
                <div className="mb-3 text-[var(--color-green)] opacity-70">
                  {tipo.icon}
                </div>
                <p className="mb-1.5 font-sans text-[14.5px] font-semibold text-[var(--color-ink)]">
                  {tipo.label}
                </p>
                <p className="font-sans text-[13px] leading-[1.6] text-[var(--color-ink-sub)]">
                  {tipo.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[14px] border border-[rgba(45,95,79,0.12)] bg-[rgba(45,95,79,0.04)] px-6 py-5">
            <p className="font-sans text-[13.5px] leading-[1.7] text-[var(--color-ink-sub)]">
              Você decide quem vê o quê. Um cuidador pode ter acesso à lista de medicamentos sem ver os documentos jurídicos. Um familiar distante pode ser notificado sem ter acesso ao cofre.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
