# Tailwind v4 Refactor Plan

Migrate landing/page components from inline `style={{}}` + legacy CSS classes
in `globals.css` to Tailwind v4 utilities — without destroying the visual
design or mobile responsiveness, as happened in the prior attempt that
forced a hard reset to `5a2beda`.

---

## 1. Context — why this exists

Current state (commit `5a2beda`, in production) has two systems working
together:

- **Inline `style={{}}`** on components → owns colors, typography, spacings,
  shadows, gradients.
- **`@media (max-width: 768px)` block in `src/app/globals.css`** → owns
  mobile responsive overrides via legacy classes
  (`.hero-mockup-split`, `.fundadora-card`, `.manifesto-mockup-split`,
  `.grid-pillar`, `.grid-footer`, `.nav-desktop`, `.show-mobile`, etc.).

The previous attempt failed by:

1. Deleting the entire `@media` block before components had Tailwind
   responsive equivalents → mobile collapse disappeared.
2. Half-converting components (`className="grid grid-cols-1 md:grid-cols-2"`
   coexisting with `style={{ gridTemplateColumns: '1fr 1fr' }}`) — inline
   wins by specificity, so the Tailwind responsive layer never activated.
3. Dozens of subtle conversion errors (`not-italic` instead of `italic`,
   `rounded-sm` instead of `rounded-[10px]`, invalid utilities like `z-1`
   `z-2` `border-3`, `bg-header-surface` that never resolved because
   `--header-surface` is in `:root` not `@theme`).
4. Disguised redesign (card wrappers, smaller avatars, lost terracotta
   accents) bundled inside what was supposed to be a pure refactor.

This plan prevents all of that.

---

## 2. Pre-conditions (one-time setup)

```sh
# Always work in a feature branch
git checkout -b refactor/tailwind-<component>

# Baseline visual snapshots (ANTES of any change)
npm run test:e2e -- --update-snapshots

# Confirm clean tree before starting
git status
npx tsc --noEmit
npm run lint
```

If `test:e2e` snapshots don't cover the page yet, add them first as a
separate prep commit. Without baseline snapshots there is no objective
"is this still the same?" check.

---

## 3. Mapping phase (build once, reuse forever)

Build three reference tables before touching code. Save them in
`docs/tailwind-tokens.md` — they make every conversion mechanical instead
of guesswork.

### 3.1 Token table

```sh
# Extract @theme tokens
sed -n '/@theme/,/^}/p' src/app/globals.css | grep -E '^\s+--'
```

Map each `--color-X` (and other `--font-*`, `--radius-*`, `--shadow-*`,
`--ease-*`) declared in `@theme` to its Tailwind utility prefix. Anything
in `@theme` becomes a utility automatically:

| CSS var                     | Tailwind utility            |
| --------------------------- | --------------------------- |
| `--color-green-dark`        | `bg-green-dark`, `text-green-dark`, `border-green-dark` |
| `--color-terracotta`        | `bg-terracotta`, `text-terracotta` |
| `--color-ink-sub`           | `text-ink-sub` |
| `--shadow-terracotta-button`| `shadow-terracotta-button` |
| `--font-serif`              | `font-serif` |

CSS vars in `:root` only (not `@theme`) like `--header-surface`,
`--footer-surface` do **not** auto-generate utilities. Use arbitrary
syntax: `bg-[var(--header-surface)]`.

### 3.2 Legacy class table

```sh
# Find all legacy class definitions
grep -nE '^\.[a-z]' src/app/globals.css

# For each class, find media queries that override it
grep -nE 'fundadora-card|hero-mockup|manifesto-mockup|grid-pillar' src/app/globals.css
```

For each legacy class, list:

- Where it's used (`grep -rn "fundadora-card" src/`)
- Default rules
- Mobile override rules
- The Tailwind equivalent that will replace each

Example:

| Legacy class        | Default                                | Mobile (`@media ≤768px`)              | Tailwind replacement |
| ------------------- | -------------------------------------- | ------------------------------------- | -------------------- |
| `.hero-mockup-split`| `display:grid; grid-cols:1fr 1fr`      | `grid-cols:1fr`                       | `grid grid-cols-1 md:grid-cols-2` |
| `.hero-mockup-photo`| (none default)                         | `min-height:48vh; order:1`            | `h-[48vh] md:h-auto order-1 md:order-2` |
| `.fundadora-card`   | (none default)                         | `align-items:center; text-align:center`| `items-center text-center md:items-start md:text-left` |
| `.grid-pillar`      | `grid-cols:1fr 1fr; gap:48-80px`       | `grid-cols:1fr; gap:24px`             | `grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[clamp(48px,7vw,80px)]` |
| `.show-mobile`      | `display:none`                         | `display:flex`                        | `hidden md:flex` (inverted: use `flex md:hidden`) |
| `.nav-desktop`      | `display:flex`                         | `display:none`                        | `hidden md:flex` |

### 3.3 Component fila (work queue)

```sh
grep -rln "style={{" src/features/landing src/features/dashboard \
  src/features/vault src/features/auth src/app | sort
```

Order from least-blast-radius to most:

1. Leaf components (BrandStar, BrandDecorative)
2. Section components (Hero, FundadorasStrip, Manifesto, etc.)
3. Layout components (Header, Footer)
4. Page-level files (`src/app/*/page.tsx`)

---

## 4. Conversion rules (canonical reference)

### 4.1 Colors / typography / spacing tokens

| Source                                | Target                       |
| ------------------------------------- | ---------------------------- |
| `color: 'var(--color-X)'`             | `text-X` (X em `@theme`)     |
| `color: 'var(--header-surface)'`      | `text-[var(--header-surface)]` |
| `background: 'var(--color-X)'`        | `bg-X`                       |
| `fontFamily: 'var(--font-serif)'`     | `font-serif`                 |
| `padding: 'clamp(40px,6vw,100px)'`    | `p-[clamp(40px,6vw,100px)]`  |
| `borderRadius: 10`                    | `rounded-[10px]` (NÃO `rounded-sm`) |
| `letterSpacing: '-0.03em'`            | `tracking-[-0.03em]` (NÃO `tracking-tight`) |
| `boxShadow: '0 4px 24px rgba(...)'`   | `shadow-[0_4px_24px_rgba(...)]` (vírgulas viram `_`) |
| `fontStyle: 'italic'`                 | `italic` (NUNCA `not-italic`) |
| `fontWeight: 600`                     | `font-semibold` (500=`font-medium`, 700=`font-bold`) |

### 4.2 Layout

| Source                                              | Target                       |
| --------------------------------------------------- | ---------------------------- |
| `display: 'flex'`                                   | `flex`                       |
| `display: 'grid', gridTemplateColumns: '1fr 1fr'`   | `grid grid-cols-2`           |
| `gridTemplateColumns: '1fr minmax(280px,0.85fr)'`   | `grid-cols-[1fr_minmax(280px,0.85fr)]` |
| `flexDirection: 'column'`                           | `flex-col`                   |
| `alignItems: 'center'`                              | `items-center`               |
| `justifyContent: 'center'`                          | `justify-center`             |
| `position: 'absolute', inset: 0`                    | `absolute inset-0`           |
| `zIndex: 2`                                         | `z-[2]` (Tailwind tem só `z-0/10/20/30/40/50` — `z-1`/`z-2` NÃO existem por padrão) |
| `margin: '0 auto'`                                  | `mx-auto`                    |

### 4.3 Responsive (mobile-first)

Tailwind v4 default breakpoints: `sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px`.

| Old `@media (max-width: 768px)`              | New (mobile-first)                                |
| -------------------------------------------- | ------------------------------------------------- |
| `.X { grid-cols: 1fr !important }` (mobile)  | `grid-cols-1 md:grid-cols-2` (mobile is base)     |
| `.X { display: none !important }` (mobile)   | `hidden md:flex` (block desktop, none mobile)     |
| `.X { padding: 24px !important }` (mobile)   | `p-6 md:p-[clamp(...)]`                           |
| `.X { text-align: center !important }`       | `text-center md:text-left`                        |
| `.X { order: 1 !important }`                 | `order-1 md:order-2`                              |

**Princípio:** mobile é o estado base (sem prefixo). Desktop usa `md:`/`lg:`.
Inverso do legado (que era desktop-default, mobile-override).

### 4.4 Coisas que ficam inline (Tailwind expressa mal)

- Background gradients multi-stop com `color-mix()` ou múltiplos `radial-gradient`
- Filtros complexos combinados (`filter: 'brightness(0) invert(1) saturate(0)'`)
- `mix-blend-mode: soft-light/overlay` (existe `mix-blend-overlay` mas casos exóticos é mais limpo inline)

Nesses casos: deixar `style={{ background: '...' }}` mas remover do `style`
qualquer propriedade que conflita com Tailwind no mesmo elemento.

---

## 5. Per-component workflow (loop)

Para CADA componente, executar este loop completo. Não pular passos.

```sh
# 1. Snapshot before (commit baseline se mudou)
npm run test:e2e -- --grep "<NomeDoComponente>"
# se snapshots não existem: criar
npm run test:e2e -- --grep "<NomeDoComponente>" --update-snapshots
git add tests/__screenshots__ && git commit -m "test: baseline <comp>"

# 2. Converter o componente — UMA passada, 100% do arquivo
# Não deixar style={{}} + className="" no mesmo elemento.
# Se gradient inline ficou, ele é o ÚNICO style do elemento.

# 3. Typecheck
npx tsc --noEmit

# 4. Lint
npx eslint src/features/landing/components/<Comp>.tsx

# 5. Visual diff
npm run test:e2e -- --grep "<NomeDoComponente>"
# Aceita o diff? Aprova snapshots:
npm run test:e2e -- --grep "<NomeDoComponente>" --update-snapshots
# NÃO aceita? Volta:
git checkout -- src/features/landing/components/<Comp>.tsx

# 6. Mobile real (DevTools 360px) — abrir e verificar visualmente
npm run dev
# checar /, /login, /dashboard se o componente está em alguma dessas

# 7. Commit isolado
git add src/features/landing/components/<Comp>.tsx tests/__screenshots__
git commit -m "refactor(<comp>): convert inline styles to tailwind utilities"
```

**Atomicidade é tudo.** Um commit = um componente = um revert possível.

---

## 5.1 Lesson learned: structural wrappers are not atoms

Regression found during `Footer.tsx` refactor:

- The visual broke even though `typecheck` and `lint` passed.
- Root cause: the footer grid depended on global CSS (`#footer-grid`) and
  structural wrapper styles (`maxWidth`, `margin: 0 auto`, `gridTemplateColumns`,
  macro padding). Moving those to Tailwind changed cascade/priority and altered
  the rendered layout.
- Fix: restore structural styles surgically, keep only low-risk internal atoms
  converted, then validate with a screenshot.

New rule:

- Do not migrate structural wrappers (`section`, `footer`, `header`, main grids,
  page containers, responsive layout shells) in the same pass as internal atoms.
- Before touching any wrapper, search `globals.css` for related `id`, class,
  media query, and `!important` overrides.
- Treat wrappers as a separate high-risk atom that requires before/after print
  or visual snapshot approval.
- Passing `typecheck` + `lint` is not enough for UI refactors. A visual check is
  mandatory before marking the atom done.
- If visual fidelity matters more than removing inline styles, keep the exact
  inline style. This is a refactor, not a redesign.

Footer status:

- `Footer.tsx` internal atoms were partially converted.
- Structural wrappers were restored because they are layout-critical.
- Newsletter was adjusted and visually approved by screenshot.
- Status: stabilized. Do not continue converting footer structure without a new
  baseline screenshot and explicit review.

---

## 6. Common pitfalls (com exemplos do que aconteceu)

### 6.1 Inline + Tailwind no mesmo elemento

```tsx
// ERRADO - inline ganha por especificidade, Tailwind nunca aplica
<div
  className="grid grid-cols-1 md:grid-cols-2"
  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
/>

// CERTO - Tailwind sozinho
<div className="grid grid-cols-1 md:grid-cols-2" />
```

### 6.2 `not-italic` em `<em>`

```tsx
// ERRADO - <em> é italic por padrão; not-italic REMOVE o italic
<em className="not-italic text-terracotta">amanhã.</em>

// CERTO
<em className="italic text-terracotta">amanhã.</em>
```

### 6.3 Classes Tailwind inexistentes (Tailwind v4 default)

| Inválido         | Use                                |
| ---------------- | ---------------------------------- |
| `z-1`, `z-2`     | `z-[1]`, `z-[2]`                   |
| `border-3`       | `border-[3px]`                     |
| `gap-7.5`        | `gap-[30px]`                       |
| `tracking-tightest` | `tracking-[-0.05em]`            |

### 6.4 CSS var fora de `@theme` virou utility

```css
/* globals.css */
:root {
  --header-surface: color-mix(...);  /* NÃO está em @theme */
}
```

```tsx
// ERRADO - bg-header-surface não existe (não há --color-header-surface)
<header className="bg-header-surface" />

// Opção A: arbitrary value
<header className="bg-[var(--header-surface)]" />

// Opção B: promover pra @theme primeiro (renomear var pra --color-header-surface)
```

### 6.5 Aproximar valor em vez de usar exato

```tsx
// ERRADO - "tracking-tight" é -0.025em; original era -0.03em
<h1 className="tracking-tight">...</h1>

// CERTO - valor exato
<h1 className="tracking-[-0.03em]">...</h1>
```

### 6.6 Substituir classe legada sem manter as propriedades

```css
/* globals.css */
.label-premium {
  font-family: var(--font-sans);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-terracotta);  /* ← fácil de esquecer */
  font-weight: 600;
}
```

```tsx
// ERRADO - perdeu a cor terracotta e mudou peso
<p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase">

// CERTO - mantém TODAS as propriedades originais
<p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-terracotta">
```

---

## 7. globals.css cleanup (último passo, não primeiro)

Regra: **nunca remover regra do `globals.css` no mesmo commit que adiciona
Tailwind no componente.** São dois commits sempre.

### 7.1 Sequência segura

```sh
# Commit N: adicionar Tailwind no componente, classe legada continua intacta
git commit -m "refactor(hero): convert to tailwind utilities"

# Verificar que ninguém mais usa a classe legada
grep -rn "hero-mockup-split" src/
# Se voltar vazio:

# Commit N+1: remover classe e media queries do globals.css
git commit -m "chore(css): remove unused .hero-mockup-* legacy classes"
```

### 7.2 O que remover do `@media (max-width: 768px)` é mecânico

Para cada classe listada na tabela 3.2, depois que `grep` confirma uso = 0,
deletar:

- A regra default (se houver) fora do `@media`
- A regra dentro de `@media (max-width: 768px)`
- A regra dentro de `@media (max-width: 480px)` se houver

O bloco `@media` vai encolhendo. Quando ficar vazio, deletar o próprio
bloco.

---

## 8. Guardrails (impedir regressão futura)

### 8.1 Lint rule (recomendado)

Custom ESLint rule que detecta `style={{}}` + `className=""` no mesmo
elemento JSX. Sem rule custom, alternativa: PR template com checklist
manual ("este PR mistura style + className em algum elemento? Se sim,
justificar").

### 8.2 PR checklist (em `.github/pull_request_template.md`)

```md
- [ ] Snapshots visuais atualizados se houve mudança intencional
- [ ] Testado em mobile real (DevTools 360px)
- [ ] Nenhum elemento com `style={{}}` + `className=""` setando mesma propriedade
- [ ] Nenhuma regra removida do `globals.css` no mesmo commit que adiciona Tailwind
- [ ] Valores Tailwind correspondem EXATAMENTE aos originais (não aproximados)
```

### 8.3 CI

```yaml
# .github/workflows/visual.yml — bloquear PR com regressão visual
- run: npm run test:e2e
# Falha se snapshot diff > threshold sem aprovação explícita
```

---

## 9. Rollback procedure

### 9.1 Componente individual (commit ruim)

```sh
git revert <sha-do-commit-do-componente>
```

Funciona porque cada componente é um commit atômico.

### 9.2 Refator inteiro (descartar branch)

```sh
git checkout main
git branch -D refactor/tailwind
```

Nada na branch principal foi tocado.

### 9.3 Emergency reset (se já mergeou e quebrou produção)

```sh
git checkout main
git revert <merge-commit-sha> -m 1
git push origin main
```

---

## 10. Per-component checklist (imprimir, marcar)

```
Componente: ____________________

[ ] Snapshot baseline criado
[ ] 100% do componente convertido (não half-done)
[ ] Nenhum elemento mistura style={{}} + className=""
[ ] Valores Tailwind exatos (clamps, radii, weights, opacities, tracking)
[ ] <em> usa italic (não not-italic)
[ ] z-index com [] se ≠ 0/10/20/30/40/50
[ ] borders com [] se ≠ 0/1/2/4/8
[ ] CSS vars fora de @theme usam bg-[var(--x)] / text-[var(--x)]
[ ] Mobile-first: classe base é mobile, md:/lg: para desktop
[ ] Centering mobile preservado (text-center md:text-left, items-center md:items-start)
[ ] Order swap preservado (order-1 md:order-2)
[ ] typecheck limpo
[ ] lint limpo
[ ] visual diff aceito
[ ] testado em DevTools 360px no browser
[ ] commit isolado feito (refactor(<comp>): ...)
[ ] classe legada do globals.css ainda intacta (remover em commit separado)
```

---

## Apêndice A — Componentes a refatorar (ordem sugerida)

```
Phase 1 — leaf / shared (baixo blast radius)
  src/features/landing/shared/BrandStar.tsx
  src/features/landing/shared/BrandDecorative.tsx
  src/design/Button.tsx
  src/design/Card.tsx
  src/design/Field.tsx

Phase 2 — landing sections (médio)
  src/features/landing/components/Hero.tsx
  src/features/landing/components/FundadorasStrip.tsx
  src/features/landing/components/Manifesto.tsx
  src/features/landing/components/ManualSection.tsx
  src/features/landing/components/CTAFinal.tsx
  src/features/landing/components/ParaQuem.tsx (Depoimento)

Phase 3 — layout (alto)
  src/features/landing/components/Header.tsx
  src/features/landing/components/Footer.tsx (stabilized: internal atoms only;
  structural wrappers intentionally preserved)

Phase 4 — pages (depende de phases anteriores estarem completas)
  src/app/dashboard/page.tsx
  src/app/vault/page.tsx
  src/app/login/page.tsx
  src/app/manual/page.tsx
  src/app/update-password/page.tsx

Phase 5 — limpeza globals.css
  remover classes legadas
  remover @media block
```

---

## Apêndice B — Comandos úteis

```sh
# Ver todas as inline styles restantes em landing
grep -rn "style={{" src/features/landing | wc -l

# Conferir uso de uma classe legada antes de deletar
grep -rn "fundadora-card" src/

# Listar tokens disponíveis em @theme
sed -n '/@theme/,/^}/p' src/app/globals.css | grep -E '^\s+--'

# Visual diff só de um componente
npm run test:e2e -- --grep "Hero"

# Build completo (typecheck + lint + test)
npm run typecheck && npm run lint && npm run test && npm run build
```

