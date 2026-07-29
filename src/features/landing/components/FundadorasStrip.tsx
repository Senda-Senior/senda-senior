/**
 * FundadorasStrip.tsx
 * Seção de SERVIÇOS/PRODUTOS (cards Manuais/Assessoria/Repositório/Parceiros) — grid desktop
 * (texto + 2x2 cards) ou accordion mobile com overlay modal.
 *
 * ALERTA ARMADILHA DE NOMES (id vs conteúdo): apesar do nome "FundadorasStrip", esta seção NÃO
 *    mostra as fundadoras — mostra os serviços. Seu id é `#por-quem-viveu` (label "Serviços"
 *    no menu). As FUNDADORAS (bios) ficam no componente PorQuemViveu, id `#sobre`. Os ids
 *    batem com o HEADING de cada seção, não com o nome do componente. Não troque os ids.
 *
 * Conecta: CARDS de @/features/landing/data/fundadoras-strip | Reveal de @/design | useLenis, useMediaQuery
 * Camada: browser
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import NextImage from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Files, HeartHandshake, Users, ShieldCheck, CalendarCheck, FileText, Stethoscope } from 'lucide-react'
import { Reveal } from '@/design'
import { useMediaQuery } from '@/lib/utils/mediaQuery'

import { CARDS } from '@/features/landing/data/fundadoras-strip'

const MOBILE_PRODUCT_QUERY = '(max-width: 768px), (orientation: landscape) and (max-height: 500px)'

const ICONS = {
  'book-open': BookOpen,
  'heart-handshake': HeartHandshake,
  files: Files,
  users: Users,
} as const

const MOBILE_CARD_RADIUS = 'var(--radius-lg)'

function ExpandedManuais({ onClose, isMobile }: { onClose: () => void; isMobile?: boolean }) {
  const manuais = [
    { num: '01', fase: 'Fase 1', titulo: 'Prevent Care', desc: 'Pais ainda autônomos. O melhor momento para planejar.', bg: 'var(--color-sage-pale)', numColor: 'var(--color-forest)', titleColor: 'var(--color-forest)', descColor: 'var(--color-forest-60)' },
    { num: '02', fase: 'Fase 2', titulo: 'Care', desc: 'Os primeiros sinais apareceram. Hora de agir com estrutura.', bg: 'var(--color-warm-tan)', numColor: 'var(--color-brown-deep)', titleColor: 'var(--color-brown-deep)', descColor: 'var(--color-brown-deep-60)' },
    { num: '03', fase: 'Fase 3', titulo: 'Immediate Care', desc: 'Supervisão constante. Decisões urgentes com clareza.', bg: 'var(--color-terracotta)', numColor: 'rgba(255,255,255,0.25)', titleColor: 'white', descColor: 'rgba(255,255,255,0.7)' },
  ]
  return (
    <div className="flex h-full w-full flex-col px-2 pt-4">
      {!isMobile && (
        <div className="flex justify-between items-start w-full mb-8">
          <button onClick={onClose} className="flex items-center gap-2 border-2 border-[var(--color-terracotta)] text-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] hover:text-white transition-colors px-5 py-2.5 rounded-full font-sans text-sm font-bold">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar aos produtos
          </button>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-[var(--color-ink)]">Os Manuais</h2>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full flex-1 items-center pb-8 md:pb-0">
        {/* Texto esquerda */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-sans text-[11.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)] mb-4">Metodologia Senda Sênior</p>
          <h3 className="font-serif text-[clamp(28px,3vw,38px)] font-semibold text-[var(--color-ink)] leading-tight mb-4">
            Três momentos,<br />um caminho.
          </h3>
          <p className="font-sans text-[15px] leading-relaxed text-[var(--color-ink-sub)] mb-8 max-w-[320px]">
            Cada manual foi escrito para o momento exato que a sua família está vivendo — sem exageros, sem falta.
          </p>
          <Link href="/#manuais" onClick={onClose} className="inline-flex items-center gap-3 bg-[var(--color-terracotta)] text-white px-7 py-3 rounded-full font-bold text-[13px] tracking-widest uppercase hover:opacity-90 transition-opacity self-start">
            Ver todos os manuais <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
        {/* Cards direita */}
        <div className="w-full md:w-[320px] flex flex-col gap-3 flex-shrink-0">
          {manuais.map((m) => (
            <div key={m.titulo} className="rounded-2xl px-5 py-4 flex items-center gap-4" style={{ background: m.bg }}>
              <span className="font-serif text-[40px] font-light leading-none flex-shrink-0" style={{ color: m.numColor }}>{m.num}</span>
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: m.descColor }}>{m.fase}</p>
                <p className="font-serif text-[17px] font-semibold leading-tight" style={{ color: m.titleColor }}>{m.titulo}</p>
                <p className="font-sans text-[12.5px] leading-snug mt-1" style={{ color: m.descColor }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExpandedAssessoria({ onClose, isMobile }: { onClose: () => void; isMobile?: boolean }) {
  const etapas = [
    { num: '01', icon: <Stethoscope size={18} strokeWidth={1.8} />, titulo: 'Diagnóstico', desc: 'Avaliamos a situação atual do idoso e da família.' },
    { num: '02', icon: <FileText size={18} strokeWidth={1.8} />, titulo: 'Plano de cuidado', desc: 'Estruturado, revisável e adaptado à realidade de cada família.' },
    { num: '03', icon: <CalendarCheck size={18} strokeWidth={1.8} />, titulo: 'Acompanhamento', desc: 'Presença contínua nos momentos que mais importam.' },
  ]
  return (
    <div className="flex h-full w-full flex-col px-2 pt-4">
      {!isMobile && (
        <div className="flex justify-between items-start w-full mb-8">
          <button onClick={onClose} className="flex items-center gap-2 border-2 border-[var(--color-terracotta)] text-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] hover:text-white transition-colors px-5 py-2.5 rounded-full font-sans text-sm font-bold">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar aos produtos
          </button>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-[var(--color-ink)]">A Assessoria</h2>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full flex-1 items-center pb-8 md:pb-0">
        {/* Texto esquerda */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-sans text-[11.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)] mb-4">Assessoria personalizada</p>
          <h3 className="font-serif text-[clamp(26px,2.8vw,36px)] font-semibold text-[var(--color-ink)] leading-tight mb-4">
            Junto com você,<br />no ritmo da família.
          </h3>
          <p className="font-sans text-[15px] leading-relaxed text-[var(--color-ink-sub)] mb-8 max-w-[320px]">
            Orientação individual para quem está diante de decisões reais. Não existe resposta genérica para quem cuida.
          </p>
          <Link href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[var(--color-terracotta)] text-white px-7 py-3 rounded-full font-bold text-[13px] tracking-widest uppercase hover:opacity-90 transition-opacity self-start">
            Agendar conversa <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
        {/* Etapas direita */}
        <div className="w-full md:w-[320px] flex flex-col gap-3 flex-shrink-0">
          {etapas.map((e) => (
            <div key={e.num} className="rounded-2xl px-5 py-4 flex items-start gap-4 bg-[var(--color-gold-light)]">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--color-terracotta)] text-white flex items-center justify-center mt-0.5">
                {e.icon}
              </div>
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--color-brown-deep-60)] mb-0.5">{e.num}</p>
                <p className="font-serif text-[16px] font-semibold text-[var(--color-brown-deep)] leading-tight">{e.titulo}</p>
                <p className="font-sans text-[13px] leading-snug text-[var(--color-brown-deep-60)] mt-1">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExpandedRepositorio({ onClose, isMobile }: { onClose: () => void; isMobile?: boolean }) {
  const docs = [
    { icon: <Stethoscope size={16} strokeWidth={1.8} />, label: 'Laudos e prescrições médicas' },
    { icon: <FileText size={16} strokeWidth={1.8} />, label: 'Procurações e documentos jurídicos' },
    { icon: <ShieldCheck size={16} strokeWidth={1.8} />, label: 'Planos de saúde e contatos de emergência' },
    { icon: <CalendarCheck size={16} strokeWidth={1.8} />, label: 'Histórico de cuidadores e rotinas' },
  ]
  return (
    <div className="flex h-full w-full flex-col px-2 pt-4">
      {!isMobile && (
        <div className="flex justify-between items-start w-full mb-8">
          <button onClick={onClose} className="flex items-center gap-2 border-2 border-[var(--color-terracotta)] text-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] hover:text-white transition-colors px-5 py-2.5 rounded-full font-sans text-sm font-bold">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar aos produtos
          </button>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-[var(--color-ink)]">O Repositório</h2>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full flex-1 items-center pb-8 md:pb-0">
        {/* Texto esquerda */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-sans text-[11.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)] mb-4">Cofre digital</p>
          <h3 className="font-serif text-[clamp(26px,2.8vw,36px)] font-semibold text-[var(--color-ink)] leading-tight mb-4">
            Tudo em um lugar.<br />Seguro e acessível.
          </h3>
          <p className="font-sans text-[15px] leading-relaxed text-[var(--color-ink-sub)] mb-4 max-w-[320px]">
            Compartilhe com quem você confia. Ninguém mais precisa procurar o documento certo na hora errada.
          </p>
          <div className="flex items-center gap-2 mb-8">
            <ShieldCheck size={14} strokeWidth={2} className="text-[var(--color-green)]" />
            <span className="font-sans text-[12px] text-[var(--color-ink-55)]">Criptografia SSL/TLS e AES-256</span>
          </div>
          <Link href="/vault" className="inline-flex items-center gap-3 bg-[var(--color-terracotta)] text-white px-7 py-3 rounded-full font-bold text-[13px] tracking-widest uppercase hover:opacity-90 transition-opacity self-start">
            Acessar meu repositório <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
        {/* Documentos direita */}
        <div className="w-full md:w-[300px] flex flex-col gap-3 flex-shrink-0">
          {docs.map((d) => (
            <div key={d.label} className="rounded-2xl px-5 py-3.5 flex items-center gap-3 bg-[var(--color-sage-pale)]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-forest)] text-white flex items-center justify-center">
                {d.icon}
              </div>
              <p className="font-sans text-[14px] font-medium text-[var(--color-forest)] leading-snug">{d.label}</p>
            </div>
          ))}
          <div className="rounded-2xl px-5 py-3 flex items-center gap-2 border border-dashed border-[var(--color-ink-30)]">
            <span className="font-sans text-[13px] text-[var(--color-ink-45)]">+ Qualquer documento importante</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExpandedParceiros({ onClose, isMobile }: { onClose: () => void, isMobile?: boolean }) {
  const specialties = [
    'Quiropraxia',
    'Ortopedia',
    'Cardiologia',
    'Oftalmologia',
    'Fisioterapia',
    'Geriatria',
    'Nutrição',
    'Psicologia',
  ]

  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="flex h-full w-full flex-col px-2 pt-4">
      {/* Top Header */}
      {!isMobile && (
        <div className="flex justify-between items-start w-full mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 border-2 border-[var(--color-terracotta)] text-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)] hover:text-white transition-colors px-5 py-2.5 rounded-full font-sans text-sm font-bold"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar aos produtos
          </button>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-[var(--color-ink)]">
            Os Parceiros
          </h2>
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 w-full flex-1 items-center pb-8 md:pb-0">
        {/* Text */}
        <div className="flex-1 flex flex-col justify-center relative w-full">
          {/* Dropdown Filters */}
          <div className="mb-8 relative w-[280px] z-20">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-sub)] mb-2 ml-1">
              Escolha a especialidade:
            </label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full bg-white border border-[var(--color-terracotta-light)] rounded-full px-5 py-3 cursor-pointer hover:border-[var(--color-terracotta)] transition-colors"
            >
              <span className="font-sans text-[15px] font-semibold text-[var(--color-ink)]">
                {selectedSpecialty}
              </span>
              <ChevronDown size={18} className={`text-[var(--color-terracotta)] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-[20px] shadow-xl border border-[rgba(42,37,32,0.08)] overflow-hidden">
                  <div className="max-h-60 overflow-y-auto py-2">
                    {specialties.map(s => (
                      <div
                        key={s}
                        onClick={() => {
                          setSelectedSpecialty(s)
                          setIsDropdownOpen(false)
                        }}
                        className={`px-5 py-3 text-[14px] font-medium cursor-pointer transition-colors ${
                          selectedSpecialty === s 
                            ? 'bg-[var(--color-terracotta-light)] text-[var(--color-ink)]' 
                            : 'text-[var(--color-ink-sub)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]'
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
              </div>
            )}
          </div>

          <div className="inline-flex px-3 py-1 rounded-full border border-[var(--color-terracotta-light)] text-[var(--color-terracotta)] text-[10px] font-bold tracking-widest uppercase mb-6 w-max">
            • Especialista em {selectedSpecialty}
          </div>
          <h3 className="font-serif text-4xl font-bold text-[var(--color-ink)] mb-6">
            Dr. Roberto Mendes
          </h3>
          <p className="font-sans text-[16.5px] leading-relaxed text-[var(--color-ink-sub)] mb-10 max-w-[90%]">
            Especialista em {selectedSpecialty.toLowerCase()} por mais de 15 anos. Possui longa
            experiência na área de <strong className="text-[var(--color-ink)]">cuidado com idosos</strong>, com foco em mobilidade,
            alívio de dores crônicas e qualidade de vida.
            <br />
            <br />
            Atua em parceria com nossa rede de apoio, oferecendo atendimento
            humanizado e personalizado para cada paciente.
          </p>
          <div>
            <Link href="/login" className="inline-flex items-center gap-3 bg-[var(--color-terracotta)] text-white px-8 py-3.5 rounded-full font-bold text-[13px] tracking-widest uppercase hover:opacity-90 transition-opacity">
              Acesse a nossa rede <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Photo */}
        <div className="w-full md:w-[340px] h-[260px] md:h-[340px] relative rounded-3xl overflow-hidden bg-[var(--color-terracotta-light)] shadow-sm flex-shrink-0 flex flex-col items-center justify-center">
          <NextImage
            src="/brand/photos/doutor_roberto.png"
            alt="Dr. Roberto Mendes"
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-cover object-[center_20%]"
          />
        </div>
      </div>
    </div>
  )
}

export function FundadorasStrip() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const isMobile = useMediaQuery(MOBILE_PRODUCT_QUERY)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lenisStopped = useRef(false)
  const lenis = useLenis()

  useEffect(() => {
    if (isMobile && activeCard) {
      const el = document.getElementById(`accordion-card-${activeCard}`)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'auto' })
    }
  }, [activeCard, isMobile])

  useEffect(() => {
    if (isMobile === false && activeCard) {
      lenis?.stop()
      lenisStopped.current = true
    } else if (lenisStopped.current) {
      lenis?.start()
      lenisStopped.current = false
    }
    return () => {
      if (lenisStopped.current) {
        lenis?.start()
        lenisStopped.current = false
      }
    }
  }, [activeCard, isMobile, lenis])

  // On bfcache restore, React doesn't re-run effects — Lenis may still be
  // stopped and activeCard stale. Reset both.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setActiveCard(null)
        lenis?.start()
        lenisStopped.current = false
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [lenis])

  useEffect(() => {
    if (isMobile || !activeCard) return
    const overlay = overlayRef.current
    if (!overlay) return
    const previousFocus = document.activeElement as HTMLElement
    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
    focusable[0]?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveCard(null); return }
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [activeCard, isMobile])

  return (
    // id `#por-quem-viveu` = seção de SERVIÇOS (menu "Serviços"). As fundadoras ficam em
    // PorQuemViveu / `#sobre`. Ver "ARMADILHA DE NOMES" no topo do arquivo.
    <section
      id="por-quem-viveu"
      style={{
        background: 'var(--color-cream)',
        position: 'relative',
        overflowX: 'hidden',  // only clip horizontal overflow
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 100px)',
      }}
    >
      {/* O Grid Base Sempre Renderiza */}
      <div
        className="landing-max grid-pillar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.02fr) minmax(0, 0.98fr)',
          gap: 'clamp(48px, 6vw, 80px)',
          alignItems: isMobile ? 'start' : 'center',
        }}
      >
        {/* Lado Esquerdo: Texto */}
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
              Por quem viveu
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
              Nascemos<br />
              de quem<br />
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

        {/* Lado Direito: Grid de Cards 2x2 (desktop) ou Accordion (mobile) */}
        <div className="w-full relative">

          {/* Grid 2x2 — apenas no desktop. No mobile é sempre o accordion abaixo. */}
          {isMobile === false && (
            <div className="cards-grid" style={{ gap: 18 }}>
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
              {CARDS.map((card) => {
                const Icon = ICONS[card.icon]

                return (
                  <button
                    key={card.icon}
                    type="button"
                    onClick={() => setActiveCard(card.icon)}
                    className="flex h-full min-h-[214px] w-full flex-col gap-[18px] overflow-hidden rounded-[18px] py-[30px] pl-[clamp(22px,2vw,28px)] pr-[clamp(22px,2vw,28px)] text-left outline-none transition-transform duration-150 hover:z-10 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)]"
                    style={{
                      background: card.bg,
                      boxShadow: '0 18px 42px rgba(42, 37, 32, 0.08)',
                    }}
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
                        {card.title}
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
                        {card.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Accordion mobile — sempre visível no mobile, expandido ao clicar */}
          {isMobile === true && (
            <div id="deck-container" className="flex flex-col w-full relative scroll-mt-24">
              <div className="flex-1 flex flex-col overflow-visible relative">
                {CARDS.map((card, i) => {
                  const Icon = ICONS[card.icon]
                  const isActive = activeCard === card.icon

                  return (
                    <div
                      id={`accordion-card-${card.icon}`}
                      key={card.icon}
                      role={!isActive ? 'button' : undefined}
                      tabIndex={!isActive ? 0 : undefined}
                      aria-expanded={isActive}
                      aria-label={card.title}
                      onClick={() => {
                          if (!isActive) setActiveCard(card.icon)
                      }}
                      onKeyDown={(e) => {
                        if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          setActiveCard(card.icon)
                        }
                      }}
                      className={`w-full flex flex-col overflow-hidden shrink-0 border border-[rgba(42,37,32,0.04)] transition-[background-color,border-color,box-shadow,opacity,margin] duration-150 ease-out ${!isActive ? 'cursor-pointer hover:opacity-90' : ''}`}
                      style={{
                        background: isActive ? 'white' : card.bg,
                        borderRadius: MOBILE_CARD_RADIUS,
                        marginTop: i === 0 ? '0' : '-14px',
                        marginBottom: isActive ? '16px' : '0',
                        zIndex: isActive ? CARDS.length + 1 : CARDS.length - i,
                        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
                      }}
                    >
                        {/* Card Header (Visible in deck) */}
                        <div
                          className="flex h-[72px] shrink-0 items-center justify-between px-6 transition-colors duration-150"
                          style={{
                            backgroundColor: isActive ? 'var(--color-terracotta)' : 'transparent',
                            color: isActive ? '#fff' : 'var(--color-ink)',
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <Icon size={24} strokeWidth={2} />
                            <h3 className="m-0 font-sans text-[16px] font-bold">
                              {card.title}
                            </h3>
                          </div>
                          {isActive && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveCard(null) }}
                              aria-label="Fechar"
                              className="text-white hover:bg-[rgba(255,255,255,0.2)] p-2 rounded-full transition-colors"
                            >
                              <ArrowLeft size={20} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>

                        {isActive && (
                          <div className="flex flex-col overflow-hidden px-5 pb-8 pt-5">
                              {activeCard === 'users' && <ExpandedParceiros onClose={() => setActiveCard(null)} isMobile />}
                              {activeCard === 'book-open' && <ExpandedManuais onClose={() => setActiveCard(null)} isMobile />}
                              {activeCard === 'heart-handshake' && <ExpandedAssessoria onClose={() => setActiveCard(null)} isMobile />}
                              {activeCard === 'files' && <ExpandedRepositorio onClose={() => setActiveCard(null)} isMobile />}
                          </div>
                        )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay expandido (desktop) — sem blur full-screen */}
      {isMobile === false && activeCard && (
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Detalhes do produto"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[rgba(242,239,233,0.92)] p-12"
            onClick={() => setActiveCard(null)}
          >
            {/* Desktop View (Sidebar + Content) */}
            <div className="flex landing-max gap-8 max-h-[calc(100vh-6rem)] min-h-0 w-full items-stretch relative max-w-7xl mx-auto" onClick={(e) => e.stopPropagation()}>
              {/* Sidebar (Left) */}
              <div className="flex flex-col gap-4 w-[280px] shrink-0 pt-16">
                {CARDS.map((card) => {
                  const Icon = ICONS[card.icon]
                  const isActive = activeCard === card.icon

                  return (
                    <button
                      key={card.icon}
                      type="button"
                      onClick={() => setActiveCard(card.icon)}
                      className="flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[20px] px-4 py-8 text-center outline-none transition-transform duration-150 hover:scale-[1.01]"
                      style={{
                        background: isActive ? 'var(--color-terracotta)' : card.bg,
                        boxShadow: isActive ? '0 12px 32px rgba(42, 37, 32, 0.12)' : 'none',
                      }}
                    >
                      <div style={{ color: isActive ? 'white' : 'var(--color-ink)' }}>
                        <Icon size={32} strokeWidth={1.5} aria-hidden />
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 15,
                          fontWeight: 700,
                          color: isActive ? 'white' : 'var(--color-ink)',
                          lineHeight: 1.2,
                          margin: 0,
                        }}
                      >
                        {card.title}
                      </h3>
                    </button>
                  )
                })}
              </div>

              {/* Main Content (Right) */}
              <div className="flex-1 bg-[var(--color-cream)] rounded-[32px] p-10 flex flex-col shadow-xl border border-[rgba(42,37,32,0.06)] overflow-y-auto relative">
                {activeCard === 'users' && <ExpandedParceiros onClose={() => setActiveCard(null)} />}
                {activeCard === 'book-open' && <ExpandedManuais onClose={() => setActiveCard(null)} />}
                {activeCard === 'heart-handshake' && <ExpandedAssessoria onClose={() => setActiveCard(null)} />}
                {activeCard === 'files' && <ExpandedRepositorio onClose={() => setActiveCard(null)} />}
              </div>
            </div>
          </div>
      )}
    </section>
  )
}
