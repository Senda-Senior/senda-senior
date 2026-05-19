'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, BookOpen, Files, HeartHandshake, Users } from 'lucide-react'
import { Reveal } from '@/design'

import { CARDS } from '@/features/landing/data/fundadoras-strip'

const ICONS = {
  'book-open': BookOpen,
  'heart-handshake': HeartHandshake,
  files: Files,
  users: Users,
} as const

type ProductId = (typeof CARDS)[number]['id']

type ProductSubcategory = {
  id: string
  label: string
  headline: string
  body: string
  bullets: string[]
}

type ProductDetail = {
  headline: string
  body: string
  bullets: string[]
  subcategories?: ProductSubcategory[]
  cta: {
    label: string
    href: string
    note?: string
  }
  imageLabel: string
}

const DETAILS: Record<ProductId, ProductDetail> = {
  manuais: {
    headline: 'Um passo a passo claro para cada fase do cuidado.',
    body:
      'Os manuais organizam o que costuma virar confusão: o que observar, o que decidir, como conversar em família e como registrar tudo para não depender da memória no momento de pressa.',
    bullets: [
      'Checklist do que fazer primeiro, sem pular etapas.',
      'Perguntas certas para médicos, cuidadores e a família.',
      'Modelos simples para registrar rotinas e sinais de alerta.',
    ],
    subcategories: [
      {
        id: 'inicio',
        label: 'Início',
        headline: 'Começar do jeito certo evita remendos depois.',
        body:
          'Para quando a família percebe que algo mudou e precisa sair do improviso com rapidez e calma.',
        bullets: [
          'Mapeamento do contexto: saúde, casa, rede e rotina.',
          'Acordos familiares: responsabilidades e combinados.',
          'Plano de 30 dias com prioridades reais.',
        ],
      },
      {
        id: 'rotina',
        label: 'Rotina',
        headline: 'Rotina boa é rotina registrada.',
        body:
          'Para transformar o cuidado em previsibilidade: menos sustos, mais consistência e mais autonomia possível.',
        bullets: [
          'Organização de medicamentos e consultas.',
          'Segurança em casa com ajustes pequenos e impacto grande.',
          'Autonomia com proteção, sem transformar tudo em vigilância.',
        ],
      },
      {
        id: 'crises',
        label: 'Crises',
        headline: 'Quando aperta, o plano segura a família.',
        body:
          'Para momentos de crise e decisão: hospital, queda, perda de autonomia, mudança de casa ou de cuidador.',
        bullets: [
          'O que registrar e para quem informar.',
          'Como decidir com menos culpa e mais critério.',
          'Plano de comunicação entre família, profissionais e rotina.',
        ],
      },
    ],
    cta: {
      label: 'Quero conhecer os manuais',
      href: '/em-construcao',
      note: 'Vamos te orientar para escolher o manual certo para o seu momento.',
    },
    imageLabel: 'Preview: manual em formato de fichas e checklists',
  },
  assessoria: {
    headline: 'Uma conversa que vira plano. Um plano que vira rotina.',
    body:
      'A assessoria existe para quando você precisa de orientação sob medida, com prioridades claras e próximas da realidade da sua família.',
    bullets: [
      'Diagnóstico objetivo: o que importa agora e o que pode esperar.',
      'Plano de ação por etapas, com linguagem simples.',
      'Acompanhamento para ajustar rota sem recomeçar do zero.',
    ],
    cta: {
      label: 'Quero falar com a Senda Sênior',
      href: '/em-construcao',
      note: 'Conte seu contexto e a gente te diz o melhor próximo passo.',
    },
    imageLabel: 'Preview: sessão de assessoria com plano e prioridades',
  },
  repositorio: {
    headline: 'Tudo em um lugar só, para a família inteira acessar.',
    body:
      'O repositório é o ponto central da organização: documentos, histórico, contatos e combinados. Menos retrabalho, menos perda de informação.',
    bullets: [
      'Documentos essenciais organizados por tipo e data.',
      'Histórico de saúde e eventos importantes, com contexto.',
      'Contatos e instruções para agir rápido quando necessário.',
    ],
    subcategories: [
      {
        id: 'documentos',
        label: 'Documentos',
        headline: 'O básico bem guardado vale ouro.',
        body:
          'Modelos e organização para não ficar procurando papel em cima da hora.',
        bullets: [
          'Lista do que reunir, com foco no que realmente importa.',
          'Padrão de nomeação para achar tudo em segundos.',
          'Compartilhamento seguro com a família sem caos de versões.',
        ],
      },
      {
        id: 'historico',
        label: 'Histórico',
        headline: 'Linha do tempo para entender o que mudou.',
        body:
          'Uma visão clara do antes e depois melhora a conversa com profissionais e reduz confusão.',
        bullets: [
          'Registro de sinais, quedas, internações e mudanças.',
          'Contexto do que estava acontecendo em cada fase.',
          'Resumo pronto para consultas e conversas decisivas.',
        ],
      },
      {
        id: 'rotinas',
        label: 'Rotinas',
        headline: 'Rotina combinada, cuidado mais leve.',
        body:
          'Para alinhar família e cuidador: quem faz o quê, quando e como.',
        bullets: [
          'Mapa de tarefas e responsabilidades.',
          'Checklists de manhã, tarde e noite.',
          'Trocas de plantão com menos ruído e menos retrabalho.',
        ],
      },
    ],
    cta: {
      label: 'Quero organizar o repositório',
      href: '/em-construcao',
      note: 'A gente te mostra como montar uma estrutura simples e funcional.',
    },
    imageLabel: 'Preview: pastas, linha do tempo e checklist familiar',
  },
  parceiros: {
    headline: 'Rede de apoio confiável, do jeito que a família precisa.',
    body:
      'Parceiros são pessoas e serviços que entram para somar: cuidador, fisioterapia, clínica, ILPI e adaptações em casa. O foco é encaixar tudo no contexto real.',
    bullets: [
      'Indicar perfis de profissionais de acordo com a necessidade.',
      'Ajudar a preparar entrevistas e alinhamento de expectativas.',
      'Orientar o antes, durante e depois da troca de rotina.',
    ],
    subcategories: [
      {
        id: 'cuidadores',
        label: 'Cuidadores',
        headline: 'O cuidador certo muda a casa inteira.',
        body:
          'A gente ajuda a definir perfil, combinar rotinas e preparar a família para a chegada.',
        bullets: [
          'Roteiro de entrevista e critérios práticos.',
          'Alinhamento de tarefas: o que é cuidado e o que é apoio.',
          'Como acompanhar com respeito e clareza.',
        ],
      },
      {
        id: 'saude',
        label: 'Saúde',
        headline: 'Profissionais que conversam entre si.',
        body:
          'Orientação para montar uma rede coerente: medicina, fisioterapia, terapia ocupacional e mais.',
        bullets: [
          'Mapear especialidades e prioridades.',
          'Preparar perguntas e registros para consultas melhores.',
          'Organizar retornos e condutas para evitar retrabalho.',
        ],
      },
      {
        id: 'moradia',
        label: 'Moradia',
        headline: 'Casa segura sem virar hospital.',
        body:
          'Para avaliar adaptações e discutir alternativas quando a rotina pede outra estrutura.',
        bullets: [
          'Ajustes de segurança com custo baixo.',
          'Como avaliar opções, inclusive ILPIs, com critérios.',
          'Plano de transição com menos impacto e mais cuidado.',
        ],
      },
    ],
    cta: {
      label: 'Quero montar minha rede de apoio',
      href: '/em-construcao',
      note: 'A gente te ajuda a escolher e alinhar os parceiros certos.',
    },
    imageLabel: 'Preview: rede de apoio com profissionais e rotina',
  },
}

export function FundadorasStrip() {
  const prefersReducedMotion = useReducedMotion()
  const products = useMemo(
    () => CARDS.map((card) => ({ ...card, ...DETAILS[card.id] })),
    []
  )

  const defaultProductId: ProductId = 'manuais'
  const [activeProductId, setActiveProductId] = useState<ProductId | null>(null)
  const [activeSubId, setActiveSubId] = useState<string | null>(null)

  const activeProduct = useMemo(() => {
    const currentId = activeProductId ?? defaultProductId
    return products.find((product) => product.id === currentId) ?? products[0] ?? null
  }, [activeProductId, products])

  useEffect(() => {
    if (!activeProduct?.subcategories?.length) {
      setActiveSubId(null)
      return
    }

    setActiveSubId((current) => {
      if (current && activeProduct.subcategories?.some((tab) => tab.id === current)) {
        return current
      }

      return activeProduct.subcategories?.[0]?.id ?? null
    })
  }, [activeProduct])

  const activeSub = useMemo(() => {
    if (!activeProduct?.subcategories?.length) return null
    const fallbackId = activeProduct.subcategories[0]?.id
    const currentId = activeSubId ?? fallbackId
    return activeProduct.subcategories.find((tab) => tab.id === currentId) ?? null
  }, [activeProduct, activeSubId])

  const desktopExpanded = !!activeProductId

  const workspaceShellStyle = {
    background: 'rgba(255,255,255,0.68)',
    border: '1px solid rgba(42, 37, 32, 0.08)',
    overflow: 'hidden',
  } as const

  const desktopStageStyle = {
    minHeight: 'clamp(500px, 58vh, 580px)',
  } as const

  const renderWorkspace = (opts: { showBack: boolean }) => (
    <div className="rounded-[22px]" style={workspaceShellStyle}>
      <div
        className="flex items-center justify-between gap-3 px-5 py-4 md:px-6"
        style={{
          borderBottom: '1px solid rgba(42, 37, 32, 0.08)',
          background: 'rgba(233, 226, 210, 0.34)',
        }}
      >
        <div className="flex items-center gap-3">
          {opts.showBack && (
            <button
              type="button"
              onClick={() => setActiveProductId(null)}
              className="inline-flex items-center gap-2 rounded-[12px] px-3 py-2 text-left outline-none transition-colors hover:bg-[rgba(42,37,32,0.06)] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13.5,
                fontWeight: 650,
                color: 'var(--color-ink)',
              }}
            >
              <ArrowLeft size={18} strokeWidth={1.6} aria-hidden />
              Voltar
            </button>
          )}

          <div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-sub)',
                marginBottom: 2,
              }}
            >
              Nossos produtos
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(20px, 2.2vw, 24px)',
                fontWeight: 450,
                lineHeight: 1.1,
                color: 'var(--color-ink)',
              }}
            >
              {activeProduct?.title ?? 'Escolha um produto'}
            </p>
          </div>
        </div>

        <div className="hidden md:block">
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12.5,
              lineHeight: 1.35,
              color: 'var(--color-ink-sub)',
              maxWidth: 240,
              textAlign: 'right',
            }}
          >
            Clique para explorar. Sem sair da página.
          </p>
        </div>
      </div>

      <div className="md:grid" style={{ gridTemplateColumns: '72px minmax(0, 1fr)' }}>
        <div
          className="hidden md:flex md:flex-col md:items-center md:gap-3 md:py-4"
          style={{
            borderRight: '1px solid rgba(42, 37, 32, 0.08)',
            background: 'rgba(255,255,255,0.36)',
          }}
          aria-label="Produtos"
        >
          {products.map((product) => {
            const Icon = ICONS[product.icon]
            const active = product.id === activeProduct?.id

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setActiveProductId(product.id)}
                title={product.title}
                aria-label={product.title}
                aria-pressed={active}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40"
                style={{
                  background: active ? product.bg : 'rgba(233, 226, 210, 0.56)',
                  color: 'var(--color-ink)',
                  border: '1px solid rgba(42, 37, 32, 0.10)',
                }}
              >
                <Icon size={19} strokeWidth={1.6} aria-hidden />
              </button>
            )
          })}
        </div>

        <div className="min-w-0 px-5 py-5 md:px-6 md:py-6">
          <div className="md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-3" style={{ WebkitOverflowScrolling: 'touch' }}>
              {products.map((product) => {
                const active = product.id === activeProduct?.id

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveProductId(product.id)}
                    className="shrink-0 rounded-full px-4 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13.25,
                      fontWeight: 750,
                      background: active ? product.bg : 'rgba(233, 226, 210, 0.55)',
                      color: 'var(--color-ink)',
                      border: '1px solid rgba(42, 37, 32, 0.08)',
                    }}
                  >
                    {product.title}
                  </button>
                )
              })}
            </div>
          </div>

          {!!activeProduct?.subcategories?.length && (
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                {activeProduct.subcategories.map((tab) => {
                  const currentId = activeSub?.id ?? activeProduct.subcategories?.[0]?.id
                  const active = currentId === tab.id

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSubId(tab.id)}
                      className="shrink-0 rounded-full px-4 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        fontWeight: 750,
                        background: active ? 'rgba(42, 37, 32, 0.10)' : 'rgba(255, 255, 255, 0.55)',
                        color: 'var(--color-ink)',
                        border: '1px solid rgba(42, 37, 32, 0.10)',
                      }}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="min-w-0">
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13.8,
                  fontWeight: 650,
                  lineHeight: 1.45,
                  color: 'var(--color-ink-sub)',
                  marginBottom: 10,
                }}
              >
                {activeProduct?.desc}
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${activeProduct?.id ?? 'none'}:${activeSub?.id ?? 'base'}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(22px, 2.4vw, 28px)',
                      fontWeight: 450,
                      lineHeight: 1.15,
                      color: 'var(--color-ink)',
                      marginBottom: 12,
                      textWrap: 'balance',
                    }}
                  >
                    {activeSub?.headline ?? activeProduct?.headline}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 15.2,
                      lineHeight: 1.65,
                      color: 'var(--color-ink-sub)',
                      marginBottom: 16,
                    }}
                  >
                    {activeSub?.body ?? activeProduct?.body}
                  </p>

                  <ul className="mb-5 list-disc pl-5">
                    {(activeSub?.bullets ?? activeProduct?.bullets ?? []).map((bullet) => (
                      <li
                        key={bullet}
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14.6,
                          lineHeight: 1.55,
                          color: 'var(--color-ink)',
                          marginBottom: 8,
                        }}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              {activeProduct?.cta && (
                <div
                  className="rounded-[18px] p-4 md:p-5"
                  style={{
                    background: 'rgba(233, 226, 210, 0.55)',
                    border: '1px solid rgba(42, 37, 32, 0.10)',
                  }}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14.4,
                          fontWeight: 750,
                          color: 'var(--color-ink)',
                          lineHeight: 1.35,
                          marginBottom: 4,
                        }}
                      >
                        {activeProduct.cta.label}
                      </p>
                      {activeProduct.cta.note && (
                        <p
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 13.6,
                            color: 'var(--color-ink-sub)',
                            lineHeight: 1.45,
                          }}
                        >
                          {activeProduct.cta.note}
                        </p>
                      )}
                    </div>

                    <Link
                      href={activeProduct.cta.href}
                      className="hidden shrink-0 items-center justify-center rounded-[14px] px-4 py-[10px] text-inherit no-underline outline-none transition-colors hover:bg-[rgba(42,37,32,0.06)] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40 md:inline-flex"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13.75,
                        fontWeight: 800,
                        color: 'var(--color-ink)',
                        border: '1px solid rgba(42, 37, 32, 0.18)',
                        background: 'rgba(255,255,255,0.55)',
                      }}
                    >
                      Abrir
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[18px] p-4 lg:p-5" style={{ border: '1px solid rgba(42, 37, 32, 0.10)' }}>
              <div
                className="relative overflow-hidden rounded-[14px]"
                style={{
                  background: activeProduct?.bg ?? 'rgba(233, 226, 210, 0.55)',
                  minHeight: 168,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(42,37,32,0.03))',
                  }}
                />
                <div className="relative p-4">
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-sub)',
                      marginBottom: 10,
                    }}
                  >
                    Visual
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 14.2,
                      fontWeight: 700,
                      lineHeight: 1.35,
                      color: 'var(--color-ink)',
                    }}
                  >
                    {activeProduct?.imageLabel}
                  </p>
                </div>
              </div>

              <p
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13.2,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-sub)',
                }}
              >
                Em breve: mockups reais, amostras e exemplos do método.
              </p>
            </div>
          </div>

          {activeProduct?.cta && (
            <div
              className="sticky bottom-0 z-[1] mt-6 border-t px-5 py-4 md:hidden"
              style={{
                marginLeft: -20,
                marginRight: -20,
                background: 'linear-gradient(0deg, rgba(243,237,228,0.96) 70%, rgba(243,237,228,0.82) 100%)',
                borderColor: 'rgba(42, 37, 32, 0.08)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <Link
                href={activeProduct.cta.href}
                className="flex items-center justify-center rounded-full px-5 py-4 text-inherit no-underline outline-none transition-transform duration-[180ms] ease-out active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14.4,
                  fontWeight: 800,
                  color: 'white',
                  background: 'var(--color-terracotta)',
                }}
              >
                {activeProduct.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section
      id="sobre"
      style={{
        background: 'var(--color-cream)',
        position: 'relative',
        overflowX: 'hidden',
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 100px)',
      }}
    >
      <div
        className="landing-max grid-pillar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.02fr) minmax(0, 0.98fr)',
          gap: 'clamp(48px, 6vw, 80px)',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <Reveal>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13.8,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-terracotta)',
                marginBottom: 24,
              }}
            >
              Sobre nós
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(42px, 5vw, 68px)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                marginBottom: 40,
                textWrap: 'balance',
              }}
            >
              Nascemos
              <br />
              de quem
              <br />
              viveu na pele.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              className="landing-copy-justify"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(17.25px, 1.495vw, 18.4px)',
                lineHeight: 1.7,
                color: 'var(--color-ink-sub)',
                marginBottom: 36,
                maxWidth: 600,
              }}
            >
              A Senda Sênior nasceu da vivência real de mulheres que acompanharam de perto o envelhecimento de suas mães. Essa experiência se transformou em método, manuais e consultoria para famílias que querem se preparar, não improvisar.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div>
              <div
                style={{
                  width: 36,
                  height: 2,
                  background: 'var(--color-terracotta)',
                  borderRadius: 1,
                  marginBottom: 14,
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(17.25px, 1.495vw, 18.4px)',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  color: 'var(--color-ink)',
                }}
              >
                Somos a bússola que orienta o caminho.
              </p>
            </div>
          </Reveal>
        </div>

        <div style={{ minWidth: 0 }}>
          <div className="md:hidden">{renderWorkspace({ showBack: false })}</div>

          <div className="hidden md:block" style={desktopStageStyle}>
            <AnimatePresence mode="wait" initial={false}>
              {!desktopExpanded ? (
                <motion.div
                  key="sobre-grid"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
                  className="cards-grid h-full"
                  style={{ gap: 18 }}
                >
                  <p
                    style={{
                      gridColumn: '1 / -1',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-sub)',
                      marginBottom: 4,
                    }}
                  >
                    Nossos produtos:
                  </p>

                  {products.map((product, index) => {
                    const Icon = ICONS[product.icon]

                    return (
                      <Reveal key={product.id} delay={0.1 + index * 0.05} className="h-full min-h-0">
                        <button
                          type="button"
                          onClick={() => setActiveProductId(product.id)}
                          className="flex h-full min-h-[214px] w-full flex-col gap-[18px] overflow-hidden rounded-[18px] py-[30px] pl-[clamp(22px,2vw,28px)] pr-[clamp(22px,2vw,28px)] text-left text-inherit no-underline outline-none transition-transform duration-[200ms] ease-[ease] hover:z-10 hover:scale-[1.015] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)]"
                          style={{ background: product.bg }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-ink)' }}>
                            <Icon size={42} strokeWidth={1.3} aria-hidden />
                          </div>

                          <div>
                            <h3
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: 18,
                                fontWeight: 600,
                                color: 'var(--color-ink)',
                                lineHeight: 1.25,
                                letterSpacing: '-0.01em',
                                marginBottom: 10,
                              }}
                            >
                              {product.title}
                            </h3>
                            <p
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: 14.95,
                                lineHeight: 1.5,
                                color: 'var(--color-ink-sub)',
                                opacity: 0.9,
                              }}
                            >
                              {product.desc}
                            </p>
                          </div>
                        </button>
                      </Reveal>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="sobre-workspace"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
                >
                  {renderWorkspace({ showBack: true })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
