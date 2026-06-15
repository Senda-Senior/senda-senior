import type { SystemCategorySlug } from '../categories'

interface BannerData {
  title: string
  description: string
  color: string
  checklist: string[]
}

const BANNERS: Partial<Record<SystemCategorySlug, BannerData>> = {
  juridico: {
    title: 'Documentos Jurídicos',
    description:
      'Organize aqui os documentos legais do familiar que você cuida. Ter esses arquivos reunidos facilita decisões urgentes e protege quem você ama.',
    color: '#2D5F4F',
    checklist: [
      'RG e CPF',
      'Certidão de nascimento ou casamento',
      'Testamento',
      'Procuração (pública ou particular)',
      'Diretivas antecipadas de vontade (DAV)',
      'Documentos de imóveis e veículos',
      'Título de eleitor e passaporte',
    ],
  },
  saude: {
    title: 'Histórico de Saúde',
    description:
      'Reúna aqui os documentos de saúde do familiar que você cuida. Em uma emergência, ter essas informações acessíveis pode fazer toda a diferença.',
    color: '#B5724A',
    checklist: [
      'Lista de medicamentos em uso (dose e horário)',
      'Alergias e contraindicações',
      'Histórico de cirurgias e internações',
      'Exames recentes (sangue, imagem, eletrocardiograma)',
      'Laudos médicos e receituários',
      'Carteirinha do plano de saúde',
      'Contatos dos especialistas',
    ],
  },
}

export function VaultCategoryBanner({ slug }: { slug: string }) {
  const data = BANNERS[slug as SystemCategorySlug]
  if (!data) return null

  return (
    <div
      style={{
        marginBottom: 20,
        padding: 'clamp(16px, 2.5vw, 24px)',
        borderRadius: 14,
        background: `color-mix(in srgb, ${data.color} 8%, white)`,
        border: `1px solid color-mix(in srgb, ${data.color} 18%, transparent)`,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(17px, 1.6vw, 20px)',
          fontWeight: 600,
          color: data.color,
          marginBottom: 6,
        }}
      >
        {data.title}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 14.5,
          color: 'var(--color-ink-sub)',
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        {data.description}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: data.color,
          marginBottom: 10,
          opacity: 0.8,
        }}
      >
        Documentos recomendados
      </p>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '6px 24px',
        }}
      >
        {data.checklist.map((item) => (
          <li
            key={item}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13.8,
              color: 'var(--color-ink)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: data.color,
                flexShrink: 0,
                opacity: 0.6,
              }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
