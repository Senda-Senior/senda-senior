/**
 * mock.ts
 * Dados de preview da assessoria — solicitações, assessoras e clientes (sem backend ainda).
 *
 * Conecta: DashboardView, SolicitacoesView, AssessoriaView, painel da assessora
 * Camada: shared
 */

export type SolicitacaoStatus =
  | 'pendente'
  | 'enviado'
  | 'em_revisao'
  | 'aprovado'
  | 'precisa_atualizacao'

export type Solicitacao = {
  id: string
  titulo: string
  solicitadoPor: string
  prazo: string | null
  comentario: string | null
  status: SolicitacaoStatus
  arquivo: string | null
  /** Conteúdo local do preview (data URL) para download na visão assessora. */
  arquivoDataUrl?: string | null
}

export type Assessora = {
  id: string
  nome: string
  papel: string
  foto: string
}

export type ClienteMock = {
  id: string
  nome: string
  email: string
  status: 'em_andamento' | 'aguardando_vinculo' | 'concluido'
  etapa: string
  ultimaAtualizacao: string
  solicitacoes: Solicitacao[]
}

export const ASSESSORAS: Assessora[] = [
  {
    id: 'luciana',
    nome: 'Luciana Moura',
    papel: 'Assessora',
    foto: '/LUCIANA FOTO.webp',
  },
  {
    id: 'julianne',
    nome: 'Julianne Pimentel',
    papel: 'Assessora',
    foto: '/JULIANNE FOTO.webp',
  },
]

export const SOLICITACOES: Solicitacao[] = [
  {
    id: '1',
    titulo: 'RG atualizado',
    solicitadoPor: 'Luciana Moura',
    prazo: '10/08',
    comentario: null,
    status: 'pendente',
    arquivo: null,
  },
  {
    id: '2',
    titulo: 'Comprovante de residência',
    solicitadoPor: 'Luciana Moura',
    prazo: '12/08',
    comentario: 'Pode ser conta de luz ou água dos últimos 90 dias.',
    status: 'pendente',
    arquivo: null,
  },
  {
    id: '3',
    titulo: 'Declaração de IR',
    solicitadoPor: 'Julianne Pimentel',
    prazo: '15/08',
    comentario: 'Precisamos apenas da primeira página.',
    status: 'pendente',
    arquivo: null,
  },
  {
    id: '4',
    titulo: 'CPF',
    solicitadoPor: 'Luciana Moura',
    prazo: null,
    comentario: null,
    status: 'aprovado',
    arquivo: 'cpf.pdf',
  },
  {
    id: '5',
    titulo: 'Certidão',
    solicitadoPor: 'Julianne Pimentel',
    prazo: null,
    comentario: null,
    status: 'em_revisao',
    arquivo: 'certidao.pdf',
  },
  {
    id: '6',
    titulo: 'Procuração',
    solicitadoPor: 'Luciana Moura',
    prazo: null,
    comentario: null,
    status: 'aprovado',
    arquivo: 'procuracao.pdf',
  },
]

export const CLIENTES: ClienteMock[] = [
  {
    id: 'daniel',
    nome: 'Daniel Silva',
    email: 'daniel@exemplo.com',
    status: 'em_andamento',
    etapa: 'Em análise',
    ultimaAtualizacao: 'Hoje às 14:20',
    solicitacoes: SOLICITACOES,
  },
  {
    id: 'maria',
    nome: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    status: 'em_andamento',
    etapa: 'Pendências',
    ultimaAtualizacao: 'Ontem',
    solicitacoes: [
      {
        id: 'm1',
        titulo: 'RG',
        solicitadoPor: 'Julianne Pimentel',
        prazo: '08/08',
        comentario: null,
        status: 'aprovado',
        arquivo: 'rg.pdf',
      },
      {
        id: 'm2',
        titulo: 'Comprovante de renda',
        solicitadoPor: 'Luciana Moura',
        prazo: '14/08',
        comentario: 'Contracheque ou declaração.',
        status: 'pendente',
        arquivo: null,
      },
      {
        id: 'm3',
        titulo: 'Procuração',
        solicitadoPor: 'Luciana Moura',
        prazo: null,
        comentario: null,
        status: 'enviado',
        arquivo: 'procuracao-maria.pdf',
      },
    ],
  },
  {
    id: 'joao',
    nome: 'João Pereira',
    email: 'joao@exemplo.com',
    status: 'aguardando_vinculo',
    etapa: 'Convite enviado',
    ultimaAtualizacao: 'Há 2 dias',
    solicitacoes: [],
  },
]

export const ETAPAS = [
  { id: 'recebidos', label: 'Documentos recebidos', done: true, current: false },
  { id: 'analise', label: 'Em análise', done: false, current: true },
  { id: 'pendencias', label: 'Pendências', done: false, current: false },
  { id: 'plano', label: 'Plano final', done: false, current: false },
] as const

export function countPendencias(items: Solicitacao[] = SOLICITACOES) {
  return items.filter((s) => s.status === 'pendente' || s.status === 'precisa_atualizacao').length
}

export function getCliente(id: string): ClienteMock | undefined {
  return CLIENTES.find((c) => c.id === id)
}

export function clienteStatusLabel(status: ClienteMock['status']): string {
  switch (status) {
    case 'em_andamento':
      return 'Em andamento'
    case 'aguardando_vinculo':
      return 'Aguardando vínculo'
    case 'concluido':
      return 'Concluído'
  }
}

export function statusLabel(status: SolicitacaoStatus): string {
  switch (status) {
    case 'pendente':
      return 'Aguardando envio'
    case 'enviado':
      return 'Recebido'
    case 'em_revisao':
      return 'Em revisão'
    case 'aprovado':
      return 'Concluído'
    case 'precisa_atualizacao':
      return 'Necessita atualização'
  }
}
