/**
 * page.tsx
 * Landing page — hero, manifesto, componentes da jornada de cuidado, CTA final com SmoothScroll
 *
 * Conecta: features/landing (Hero, Manifesto, Consultoria, etc.) | SmoothScroll (Lenis)
 * Camada: browser (client components)
 */

import {
  CustomCursor,
  Header,
  Hero,
  FundadorasStrip,
  Manifesto,
  MetodologiaSection,
  ManuaisSection,
  Consultoria,
  PorQuemViveu,
  Conteudo,
  CTAFinal,
  Footer,
  SplashScreen,
  ScrollToTop,
} from '@/features/landing'
import { SmoothScroll } from '@/lib/utils/SmoothScroll'

export default function Home() {
  return (
    <SmoothScroll>
      <SplashScreen />
      <CustomCursor />
      <Header />
      <main className="relative bg-[var(--color-cream)]">
        {/* 1. Hero — sticky bottom apenas no desktop; no mobile o deck effect não existe */}
        <div id="hero" className="md:sticky md:bottom-0 md:z-0 w-full min-h-screen flex flex-col justify-start">
          <Hero />
        </div>

        {/* 2. Manifesto — deck card no desktop, scroll livre no mobile */}
        <div className="w-full bg-[var(--color-green-dark)] md:sticky md:top-0 md:z-10">
          <Manifesto />
        </div>

        {/* 3. FundadorasStrip — deck card no desktop, scroll livre no mobile.
            ALERTA id `#por-quem-viveu` (menu "Serviços"): mostra os SERVIÇOS, não as fundadoras.
            As fundadoras estão no item 7 (PorQuemViveu, id `#sobre`). Nomes cruzados de propósito
            documentado — ver cabeçalho de cada componente. */}
        <div className="w-full bg-[var(--color-cream)] md:sticky md:top-0 md:z-20">
          <FundadorasStrip />
        </div>

        {/* 4. Metodologia — Os 3 momentos do cuidado + quiz de diagnóstico.
            `relative` (não-sticky) de propósito: é teto do #manuais no CEILING e alvo de
            CTAs; sticky corromperia o getDocumentTop dele. */}
        <div id="metodologia" className="relative z-30 w-full">
          <MetodologiaSection />
        </div>

        {/* 5. ManuaisSection — showcase de manuais, deck card.
            Sticky/z-index controlados por globals.css (#manuais-deck): o efeito deck só
            engata quando há altura suficiente (min-height:880px) para conter a seção;
            em notebooks baixos vira scroll normal para o card+botão serem alcançáveis
            (sticky mais alto que o viewport esconde o excedente). */}
        <div id="manuais-deck" className="w-full bg-[var(--color-cream)]">
          <ManuaisSection />
        </div>
        {/* runway: ManuaisSection fica visível por mais 20vh antes da Consultoria subir
            (só no modo deck — ver globals.css #manuais-runway) */}
        <div id="manuais-runway" aria-hidden />

        {/* 6. Consultoria — deck card, z maior que a metodologia */}
        <div className="w-full bg-[#d3c0a2] md:sticky md:top-0 md:z-[45]">
          <Consultoria />
        </div>

        {/* 7. PorQuemViveu — scroll normal.
            ALERTA id `#sobre` (menu "Sobre"): mostra as FUNDADORAS (bios), não os serviços.
            Os serviços estão no item 3 (FundadorasStrip, id `#por-quem-viveu`). */}
        <div className="relative w-full bg-[var(--color-cream)] md:z-50">
          <PorQuemViveu />
        </div>

        {/* 8. Conteúdo — deck card */}
        <div className="w-full bg-[#626853] md:sticky md:top-0 md:z-[55]">
          <Conteudo />
        </div>

        {/* 9. CTA final — deck card */}
        <div className="w-full bg-[var(--color-cream)] md:sticky md:top-0 md:z-[60]">
          <CTAFinal />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </SmoothScroll>
  )
}
