/**
 * manuais/[slug]/page.tsx
 * Vitrine dedicada de cada manual — capa, descrição, conteúdo e compra (Hotmart)
 *
 * Conecta: MANUAIS/getManualBySlug de @/features/landing/data/fases-cuidado | Header da landing
 * Camada: server (RSC)
 */

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Header } from '@/features/landing/components/Header'
import { ManuaisMomentosNav } from '@/features/landing/components/ManuaisMomentosNav'
import { MANUAIS, getManualBySlug } from '@/features/landing/data/fases-cuidado'

const SITE = 'https://sendasenior.com.br'

/** Cor do CTA por manual — classes estáticas para o compilador do Tailwind. */
const CTA_BG: Record<string, string> = {
  'prevent-care': 'bg-[var(--color-forest)]',
  care: 'bg-[var(--color-terracotta)]',
  'immediate-care': 'bg-[var(--color-cta-brown)]',
}

const cta = `inline-block rounded-full px-[22px] py-[11px] font-sans text-[14.95px] font-semibold tracking-[0.01em] text-[var(--color-cream)] no-underline transition-[opacity,transform] duration-200 hover:opacity-90`
const h2 = 'font-serif text-[clamp(26px,2.8vw,36px)] font-normal leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)]'
const eyebrow = 'mb-3 font-sans text-[12.65px] font-bold uppercase tracking-[0.18em] text-[var(--color-terracotta)]'
const lede = 'font-sans text-[clamp(14.95px,1.265vw,17.25px)] leading-[1.6] text-[var(--color-ink-55)]'

export function generateStaticParams() {
  return MANUAIS.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const manual = getManualBySlug(slug)
  if (!manual) return {}
  const title = `Manual ${manual.tab} | Senda Sênior`
  return {
    title,
    description: manual.lede,
    alternates: { canonical: `/manuais/${manual.slug}` },
    openGraph: {
      type: 'website',
      title,
      description: manual.lede,
      url: `/manuais/${manual.slug}`,
      images: [{ url: manual.capa }],
    },
  }
}

export default async function ManualVitrine({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const manual = getManualBySlug(slug)
  if (!manual) notFound()

  const outros = MANUAIS.filter((m) => m.slug !== manual.slug)

  // Product JSON-LD — deixa o manual elegível a rich results de produto.
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Manual ${manual.tab}`,
    description: manual.lede,
    image: `${SITE}${manual.capa}`,
    url: `${SITE}/manuais/${manual.slug}`,
    brand: { '@type': 'Organization', name: 'Senda Sênior' },
    offers: {
      '@type': 'Offer',
      url: manual.link,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      <Header />

      <div className="flex justify-center px-4 pt-[clamp(108px,10vw,122px)]">
        <ManuaisMomentosNav currentSlug={manual.slug} />
      </div>

      <section className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-9 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[5fr_7fr] md:gap-[clamp(40px,7vw,96px)] md:pb-[10vh] md:pt-[8vh] lg:px-[60px]">
        <Image
          src={manual.capa}
          alt={`Capa do Manual ${manual.tab}`}
          width={900}
          height={1273}
          priority
          className="mx-auto w-full max-w-[360px] rounded-[var(--radius-lg)] shadow-[0_28px_60px_rgba(42,37,32,0.14)] md:max-w-none"
        />
        <div className="text-center md:text-left">
          <p className={eyebrow}>{manual.momento}</p>
          <h1 className="mb-5 font-serif text-[clamp(40px,4.6vw,60px)] font-normal leading-[1.05] tracking-[-0.025em]">
            Manual <em>{manual.tab}</em>
          </h1>
          <p className={`${lede} mx-auto mb-8 max-w-[52ch] md:mx-0`}>
            {manual.lede}
          </p>
          <a
            href={manual.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cta} ${CTA_BG[manual.slug]}`}
          >
            Comprar manual
          </a>
          <p className="mt-4 font-sans text-[12.65px] text-[var(--color-ink-40)]">
            Compra segura via Hotmart · garantia de 7 dias
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--color-ink-16)]">
        <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-9 px-5 py-14 sm:px-8 md:grid-cols-[5fr_7fr] md:gap-[clamp(40px,7vw,96px)] md:py-[9vh] lg:px-[60px]">
          <h2 className={h2}>O que você encontra.</h2>
          <ul className="m-0 list-none p-0">
            {manual.includes.map((item) => (
              <li
                key={item}
                className="border-b border-[var(--color-ink-16)] py-4 font-sans text-[14.95px] leading-[1.6] text-[var(--color-ink-55)] first:pt-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[var(--color-green-dark)] text-[var(--color-cream)]">
        <div className="mx-auto max-w-[760px] px-5 py-[clamp(72px,12vh,120px)] text-center sm:px-8">
          <p className="mb-9 font-serif text-[clamp(24px,2.8vw,34px)] font-normal italic leading-[1.35] tracking-[-0.01em]">
            “{manual.quote}”
          </p>
          <a
            href={manual.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-[var(--color-cream)] px-[22px] py-[11px] font-sans text-[14.95px] font-semibold tracking-[0.01em] text-[var(--color-green-dark)] no-underline transition-opacity duration-200 hover:opacity-90"
          >
            Comprar manual
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-5 py-14 sm:px-8 md:py-[9vh] lg:px-[60px]">
        <h2 className={`${h2} mb-10`}>Os outros momentos.</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
          {outros.map((m) => (
            <Link
              key={m.slug}
              href={`/manuais/${m.slug}`}
              className="group flex flex-col gap-5 rounded-[22px] border border-[rgba(42,37,32,0.08)] bg-[rgba(254,252,249,0.65)] p-5 no-underline shadow-[0_18px_40px_rgba(42,37,32,0.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(42,37,32,0.1)] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
            >
              <Image
                src={m.capa}
                alt={`Capa do Manual ${m.tab}`}
                width={280}
                height={396}
                className="mx-auto w-full max-w-[160px] rounded-[14px] shadow-[0_14px_32px_rgba(42,37,32,0.14)] sm:mx-0 sm:w-[148px] sm:max-w-none sm:shrink-0"
              />
              <span className="min-w-0 text-center sm:text-left">
                <span className="mb-1.5 block font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-terracotta)]">
                  {m.momento}
                </span>
                <span className="mb-2 block font-serif text-[clamp(22px,2.2vw,28px)] font-normal leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)]">
                  Manual {m.tab}
                </span>
                <span className="mb-4 block font-sans text-[14.5px] leading-[1.55] text-[var(--color-ink-55)]">
                  {m.desc}
                </span>
                <span className="inline-flex items-center gap-1 font-sans text-[14.5px] font-semibold text-[var(--color-terracotta)] transition-colors duration-200 group-hover:text-[var(--color-terracotta-dark)]">
                  Conhecer <span aria-hidden>→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 border-t border-[var(--color-ink-16)] px-5 pb-10 pt-6 font-sans text-[13.8px] text-[var(--color-ink-58)] sm:px-8 lg:px-[60px]">
        <Link href="/#hero" className="flex items-center gap-2.5 no-underline">
          <Image
            src="/brand/mark-symbol-dark.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span>O cuidado que começa antes da urgência.</span>
        </Link>
        <span>© 2026 Senda Sênior. Todos os direitos reservados.</span>
      </footer>
    </main>
  )
}
