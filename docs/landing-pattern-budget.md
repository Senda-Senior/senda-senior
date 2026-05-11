# Landing Pattern Budget

**Status:** revisado após pilot Phase 4. Define **a fronteira real** entre o que `<Section>` (de `src/design/`) absorve e o que fica bespoke nos componentes da landing.

**Histórico:** A versão original deste doc (commit f8d2b83) propunha aplicar `<Section>` a todos os componentes da landing, com critério de abort para componentes HEAVY. O pilot em `Consultoria.tsx` revelou que **a premissa estava errada** — a estrutura "deck-card 100svh com centro vertical" predomina e é fundamentalmente incompatível com `<Section>` (que assume scroll-page com padding vertical generoso e conteúdo top-aligned). Tentar forçar resultaria em uma cascata de overrides ou inflação de Section com props conflitantes.

Este doc é o gravestone consciente dessa decisão: **paramos de unificar wrappers**. O refactor encerra com os ganhos já conquistados (data extraction, color tokens, Reveal real) sem gerar abstração prematura.

---

## 1. Onde `<Section>` faz sentido

`<Section>` é apropriado para componentes com:
- Scroll-page natural (não sticky/deck-card)
- Padding vertical generoso (`clamp(80px, 10vw, 140px)`)
- Conteúdo top-aligned dentro do max-width
- Tone que existe em sua paleta (cream / cream-mid / terracotta-pale / green / dark / white / transparent)

Na landing atual, **nenhum** componente vivo se encaixa cleanly. `<Section>` permanece disponível em `src/design/` para uso futuro (páginas internas, blog, marketing pages secundárias) mas **não será adotado nos componentes da landing**.

---

## 2. Por que deck-cards NÃO usam `<Section>`

A landing é construída como deck de cartas sticky (`page.tsx` — cada wrapper tem `md:sticky md:top-0 md:z-XX`). Os componentes deck-card têm padrão estrutural próprio:

```tsx
<section style={{
  height: '100svh',           // full viewport
  display: 'flex',
  alignItems: 'center',        // conteúdo verticalmente centrado
  padding: '0 clamp(...)',     // ZERO vertical padding (intencional)
  background: 'var(--color-X)',
}}>
```

Comparado a `<Section>`:

| Atributo | `<Section>` provê | Deck-card precisa |
|---|---|---|
| Vertical padding | `clamp(80px, 10vw, 140px)` | `0` |
| Conteúdo align | top | center vertical |
| Height | natural (depende do conteúdo) | `100svh` |
| Tones disponíveis | 7 fixos | varia (warm-beige, green-dark, custom hex) |
| max-width | tokenizado (740/1100/1200/none) | varia (1160, 1200, 1400, etc.) |

Forçar Section aqui exigiria **4+ overrides via className**, **tones novos**, e **max-widths customizados** — equivalente a anular tudo que Section provê e re-fazer via classes. Anti-pattern.

**Componentes deck-card (ficam bespoke por design):**
- `Manifesto`, `FundadorasStrip`, `FasesCuidado`, `Consultoria`, `Conteudo`, `CTAFinal`
- `Hero`, `ManualSection` (têm padrões próprios mais complexos)

**Componentes não-deck (também ficam bespoke pelo padrão local):**
- `PorQuemViveu` (scroll normal mas tem layout próprio)
- `Footer` (footer pattern, não section pattern)

---

## 3. O que **realmente** ganhamos no refactor

Estes ganhos são reais e devem ser preservados/estendidos:

### 3.1. Data extraction (`src/features/landing/data/`)
✅ **Mantido e expandido.** Cada componente vivo tem seu data file separado. Tipo co-localizado. Sem barrel re-export. Padrão de uso:

```tsx
import { CONSULTORIA_SERVICES } from '@/features/landing/data/consultoria'
```

**Ação futura:** novos componentes seguem este padrão. Mover qualquer array residual encontrado.

### 3.2. Color tokens (`@theme` em `globals.css`)
✅ **Pass 1 feito** (Phase 2). Faltam ~51 cores hardcoded residuais (ver `docs/phase-2-residue.txt`).

**Ação imediata:** Phase 2 Pass 2 — substituir resíduos por vars tokenizadas. Zero mudança visual esperada.

### 3.3. Reveal real (`src/design/Reveal.tsx`)
✅ **Implementado e validado** (commit ff4b966). Lenis-aware, reduced-motion safe. Usado por todos os componentes que precisam de scroll-reveal.

**Ação futura:** novos componentes que precisem de fade-in usam `<Reveal>` direto. Não reinventar.

---

## 4. O que NÃO fazer no futuro

- ❌ Não tentar (de novo) aplicar `<Section>` em deck-cards. A análise foi feita; a decisão é consciente.
- ❌ Não criar `<DeckSection>` paralelo "pra não deixar feio". O padrão deck-card é 5 linhas inline e cada componente tem layout interno divergente — não há reuso real.
- ❌ Não estender `<Section>` com props `density`/`align`/`height`. Section tem o escopo certo; alargar quebra o que já funciona.
- ❌ Não refatorar visuais cuidadosamente decididos por componente em nome de "coerência". Cada deck-card tem intenção própria; respeitar isso É a coerência.

---

## 5. Estado final do refactor `refactor/landing-coherence`

| Phase | Status | Saída |
|---|---|---|
| 0 — Safety net | ✅ | `tests/landing.spec.ts` + baseline PNGs |
| 1 — Data extraction | ✅ | `src/features/landing/data/` |
| 2 — Color tokens (Pass 1) | ✅ | ~30 vars novas em `@theme` |
| 2 — Color tokens (Pass 2) | ⏳ pendente | Substituir 51 resíduos |
| 3 — Reveal real | ✅ | `src/design/Reveal.tsx` Lenis-aware |
| 4 — Pilot Servicos | ❌ abortado | Componente era órfão; pilot em Consultoria revelou descompasso Section vs deck-card |
| 5 — Rollout Section | ❌ cancelado | Premissa rejeitada — ver §2 |
| Cleanup | ✅ | 6 componentes órfãos + 4 data files deletados (commit 5561007) |

**Encerramento:** após Pass 2, branch `refactor/landing-coherence` é mergeada em `main`. Refactor terminado.
