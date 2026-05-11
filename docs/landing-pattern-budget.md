# Landing Pattern Budget

**Status:** vigente a partir de Phase 4 (pilot Servicos). Define o contrato de uso dos primitivos do design system na landing page.

**Por quê existe este documento:** Phase 5 vai aplicar este padrão em 13 componentes. Sem critério escrito, cada componente vira uma decisão nova e o pattern degenera. Este doc é o gabarito; quem refatora segue, quem não cabe é caso documentado de exceção.

---

## 1. O que `<Section>` (de `src/design/Section.tsx`) absorve

Toda seção da landing page é um wrapper `<section>` com:

- **Padding vertical generoso** (`clamp(80px, 10vw, 140px)`)
- **Padding horizontal responsivo** (`clamp(20px, 4vw, 60px)`)
- **max-width interno** centralizado (1100px content / 740px prose / 1200px wide / none full)
- **Tom de fundo** (cream / cream-mid / terracotta-pale / green / dark / white / transparent)
- **Cor de texto correlata** (ink em fundos claros, white em fundos escuros)

`<Section>` resolve **todos os 6 itens acima** em uma única tag. Nenhum componente da landing deve reimplementar wrapper + padding + max-width + background inline.

```tsx
// ANTES (padrão antigo, repetido 14x):
<section id="x" style={{
  padding: 'clamp(80px,10vw,140px) clamp(20px,4vw,60px)',
  background: 'var(--color-cream-mid)',
}}>
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>
    {children}
  </div>
</section>

// DEPOIS:
<Section id="x" tone="creamMid" maxWidth="content">
  {children}
</Section>
```

---

## 2. O que NÃO absorver (fica inline ou bespoke)

### 2.1. Tipografia bespoke (clamp values únicos)

H2/H3/labels com `clamp()` de tamanho específico ficam **inline** ou usam **CSS classes existentes** (`label-premium`, `display-serif`, etc). Não inventamos prop `<Heading variant="h2-servicos">` — viraria zoológico de variants.

```tsx
// OK:
<h2 style={{
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(36px, 4.5vw, 56px)',
  fontWeight: 500, lineHeight: 1.1,
  color: 'var(--color-ink)',
}}>
```

### 2.2. Grids únicos / layouts internos

Listas, grids de cards, deck patterns: ficam inline (Tailwind ou style). Não inventamos `<Grid cols={3}>`. CSS Grid e Flexbox já são primitivos.

### 2.3. Decorações absolutamente posicionadas (SCurve, Pattern, StarCluster)

**Caso especial:** decorações que precisam estender além do max-width do conteúdo (ex: `left: -10%` em SCurveDecoration) ficam **dentro do `<Section>`** mas como filhos diretos do content wrapper. Isso significa que elas serão clippadas/contidas pela max-width do content div, não pela full bleed da section.

**Tradeoff aceito:** a perda de cobertura é ≤60px por lado em desktop. Decorações com opacity ≤0.1 são **visualmente equivalentes** dentro vs fora do max-width. Se uma decoração precisar genuinamente de full-bleed (ex: full-width image background), use `tone="transparent"` + wrapper customizado **OU** documenta como exceção HEAVY.

**Nunca** adicione prop `decorations` ou render-prop `before`/`after` ao `<Section>`. Resolve com:
- `<Section className="relative overflow-hidden" ...>` (já dá os ganchos)
- Decorações como filhos diretos com `position: absolute`

### 2.4. Padding vertical maior que o default

Algumas seções (Hero, Servicos) usam padding vertical maior: `clamp(100px, 12vw, 180px)`.

**Decisão:** override via `className` Tailwind arbitrary, **não** prop nova:

```tsx
<Section className="!py-[clamp(100px,12vw,180px)]" tone="creamMid">
```

(O `!` força sobrescrever o `py-[clamp(80px,...)]` do Section.)

Se >3 componentes usarem o mesmo override, **promovemos** a uma variante (`density="generous"`). Antes disso, fica inline.

---

## 3. O que reusar (CSS classes existentes em `globals.css`)

Classes já definidas que devem ser usadas (foram identificadas no audit como **inutilizadas** em vários lugares):

| Classe | Onde usar |
|---|---|
| `.label-premium` | Eyebrow labels (uppercase + tracking) acima de H2 |
| `.btn-pill` | Pill buttons arredondados |
| `.btn-terracotta-hover` | Botão terracotta sólido com hover |
| `.btn-outline-terracotta-hover` | Botão outline terracotta com hover (Servicos CTA usa) |
| `.hover-fade-soft` | Links com fade sutil no hover |
| `.grid-pillar` | Grid de pilares (já presente em Servicos) |
| `.display-serif` | Headlines serif grandes (se aplicável) |

Antes de inline-stylar um botão / label / link, **grep pela classe** em `globals.css`. Se existe, usa.

---

## 4. Critério de abort para componentes HEAVY (Phase 5)

Para componentes complexos (ParaQuem, Conteudo, FasesCuidado, ManualSection, Pilares, PorQuemViveu, Problema):

**Regra:** se aplicar `<Section>` exigir QUALQUER um dos seguintes, **abort** o refactor desse componente e documenta:

1. **Adicionar prop nova** ao `<Section>` (qualquer prop além das 4 atuais: `tone`, `maxWidth`, `className`, `id`)
2. **Adicionar tone novo** que não seja reuso direto de uma cor já existente em `@theme`
3. **Wrapper extra** ao redor de `<Section>` para compensar limitação (ex: `<div class="extra-wrapper"><Section>...</Section></div>`)
4. **Mais de 5 inline styles complexos** dentro do `<Section>` que duplicam o que `<Section>` faria se tivesse uma prop a mais

**Decisão na falha:**
- **Opção A:** mantém o componente bespoke (não usa `<Section>`). Documenta no `landing-audit.md` como "exceção HEAVY: [nome]" com motivo.
- **Opção B:** cria um segundo primitivo `<DeckSectionHeavy>` em `src/design/` com as props extras necessárias. **Só se ≥3 componentes precisarem do mesmo escape hatch.**

Opção A é o default. Opção B é raro.

---

## 5. Critério de sucesso por componente (Phase 5)

Cada componente refatorado deve passar **todos** estes:

- [ ] `<Section>` substitui o wrapper externo (`<section style={{...}}>` → `<Section ...>`)
- [ ] Zero hex/rgba hardcoded (todos via `var(--color-*)` ou Tailwind)
- [ ] Dados em `src/features/landing/data/` (já feito em Phase 1)
- [ ] CSS classes existentes usadas onde aplicável (botões, labels)
- [ ] Antigravity screenshot diff: zero pixels alterados
- [ ] Smoke test manual do usuário OK

Se diff falhar, **investigar antes de re-baselinar**. Re-baseline é último recurso e exige aprovação explícita.

---

## 6. Anti-padrões (NÃO fazer)

- ❌ Criar componente novo em `src/design/` (`<Heading>`, `<Container>`, `<Grid>`) — primitivos atuais bastam
- ❌ Adicionar variantes a `<Section>` (`density`, `decorations`, `as`) — inline override resolve
- ❌ Renomear classes CSS existentes (quebra Tailwind purge + outros consumidores)
- ❌ Agrupar refactors de múltiplos componentes em um commit — um commit por componente para diff isolado
- ❌ Ignorar Antigravity diff "porque parece igual" — diff é canônico
