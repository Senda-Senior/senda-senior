import {
  CustomCursor,
  Header,
  Hero,
  FundadorasStrip,
  Manifesto,
  ManualSection,
  FasesCuidado,
  Consultoria,
  PorQuemViveu,
  Conteudo,
  CTAFinal,
  Footer,
  WhatsAppFloat,
} from '@/features/landing'
import { SmoothScroll } from '@/lib/utils/SmoothScroll'

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Header />
      <WhatsAppFloat />
      <main className="relative bg-[var(--color-cream)]">
        {/* 1. Hero — sticky bottom para deixar rolar um pouco mais e mostrar se for longa */}
        <div className="sticky bottom-0 z-0 w-full min-h-screen flex flex-col justify-start">
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

        {/* 4. Manual Section — gerencia seu próprio sticky + 300vh internamente */}
        <div id="manual" className="relative z-30 w-full">
          <ManualSection />
        </div>

        {/* 5. FasesCuidado — deck card: 130vh/sticky apenas em desktop */}
        <div className="relative md:h-[130vh]">
          <div className="w-full bg-[var(--color-cream)] md:sticky md:top-0 md:z-40">
            <FasesCuidado />
          </div>
        </div>

        {/* 6. Consultoria — deck card: 120vh/sticky apenas em desktop */}
        <div className="relative md:h-[120vh]">
          <div className="w-full bg-[var(--color-cream)] md:sticky md:top-0 md:z-[45] md:h-screen md:overflow-hidden">
            <Consultoria />
          </div>
        </div>

        {/* 7. Por quem viveu — scroll normal (conteúdo mais alto que viewport) */}
        <div className="relative z-50 w-full bg-[var(--color-cream)]">
          <PorQuemViveu />
        </div>

        {/* 8. Conteúdo — deck card: 130vh/sticky apenas em desktop */}
        <div className="relative md:h-[130vh]">
          <div className="w-full bg-[var(--color-green-dark)] md:sticky md:top-0 md:z-[55] md:h-screen md:overflow-hidden">
            <Conteudo />
          </div>
        </div>

        {/* 9. CTA final */}
        <div className="sticky top-0 z-[60] h-screen w-full overflow-hidden bg-[var(--color-cream)] flex items-center">
          <CTAFinal />
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
