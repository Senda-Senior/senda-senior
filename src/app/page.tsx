import {
  CustomCursor,
  Header,
  Hero,
  FundadorasStrip,
  Manifesto,
  ManualSection,
  ManuaisSection,
  Consultoria,
  PorQuemViveu,
  Conteudo,
  CTAFinal,
  Footer,
  WhatsAppFloat,
  SplashScreen,
} from '@/features/landing'
import { SmoothScroll } from '@/lib/utils/SmoothScroll'

export default function Home() {
  return (
    <SmoothScroll>
      <SplashScreen />
      <CustomCursor />
      <Header />
      <WhatsAppFloat />
      <main className="relative bg-[var(--color-cream)]">
        {/* 1. Hero — sticky bottom para deixar rolar um pouco mais e mostrar se for longa */}
        <div id="hero" className="sticky bottom-0 z-0 w-full min-h-screen flex flex-col justify-start">
          <Hero />
        </div>

        {/* 2. Manifesto — deck card no desktop, scroll livre no mobile */}
        <div className="w-full bg-[var(--color-green-dark)] md:sticky md:top-0 md:z-10">
          <Manifesto />
        </div>

        {/* 3. FundadorasStrip — deck card no desktop, scroll livre no mobile */}
        <div className="w-full bg-[var(--color-cream)] md:sticky md:top-0 md:z-20">
          <FundadorasStrip />
        </div>

        {/* 4. FasesCuidado — Os 3 momentos do cuidado. Gerencia seu próprio sticky + 300vh internamente */}
        <div id="manual" className="relative z-30 w-full">
          <ManualSection />
        </div>

        {/* 5. ManuaisSection — showcase de manuais, deck card */}
        <div className="w-full bg-[var(--color-cream)] md:sticky md:top-0 md:z-40">
          <ManuaisSection />
        </div>
        {/* runway: ManuaisSection fica visível por mais 20vh antes da Consultoria subir */}
        <div className="hidden md:block md:h-[20vh]" aria-hidden />

        {/* 6. Consultoria — deck card, z maior que FasesCuidado */}
        <div className="w-full bg-[#d3c0a2] md:sticky md:top-0 md:z-[45]">
          <Consultoria />
        </div>

        {/* 7. Por quem viveu — scroll normal */}
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
    </SmoothScroll>
  )
}
