import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NotFoundPage() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-cream p-6 text-ink">
      <div className="w-full max-w-[560px] text-center">
        <p className="label-premium mb-3">Página não encontrada</p>
        <h1 className="mb-[14px] font-serif text-[clamp(34px,5vw,56px)] font-medium leading-[1.1]">
          Este caminho não existe.
        </h1>
        <p className="mb-7 text-[18px] leading-[1.6] text-ink-sub">
          Volte para a página inicial para continuar sua navegação.
        </p>

        <Link
          href="/"
          className="btn-terracotta-hover inline-flex items-center justify-center gap-[10px] rounded-[8px] bg-terracotta px-6 py-[14px] text-[15px] font-bold text-white transition-all duration-300"
        >
          Ir para a Home
        </Link>
      </div>
    </main>
  )
}
