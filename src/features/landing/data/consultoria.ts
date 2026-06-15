/**
 * consultoria.ts
 * Dados dos 4 serviços de consultoria com ícones — timeline vertical, descrições curtas
 *
 * Conecta: nenhuma | importado por Consultoria.tsx
 * Camada: shared
 */

export type ConsultoriaService = {
  icon: string
  title: string
  desc: string
}

export const SERVICOS: ConsultoriaService[] = [
  {
    icon: '/icons/brand/target.svg',
    title: 'Diagnóstico da fase atual',
    desc: 'Entendemos onde sua família está hoje.',
  },
  {
    icon: '/icons/brand/tasks.svg',
    title: 'Organização das necessidades',
    desc: 'Mapeamos prioridades e recursos disponíveis.',
  },
  {
    icon: '/icons/brand/roadmap.svg',
    title: 'Plano de ação familiar',
    desc: 'Construímos um roteiro possível e realista.',
  },
  {
    icon: '/icons/brand/calendar-days.svg',
    title: 'Acompanhamento e próximos passos',
    desc: 'Suporte contínuo conforme a jornada evolui.',
  },
]
