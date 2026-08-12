/**
 * footer.ts
 * Dados do rodapé — 3 colunas nav, sociais com ícones Lucide, WhatsAppIcon custom
 *
 * Conecta: importa NavLink de types.ts | importado por Footer.tsx
 * Camada: shared
 */

import { type ComponentType } from 'react'
import { Linkedin, Facebook, Instagram } from 'lucide-react'

import { WhatsAppIcon } from '../shared/WhatsAppIcon'
import type { NavLink } from './types'

export type NavColumn = {
  title: string
  links: NavLink[]
}

/** Perfil oficial — usado na coluna CONTATO e nos ícones sociais. */
const INSTAGRAM_URL = 'https://www.instagram.com/sendasenior/'

export const NAV_COLUMNS: NavColumn[] = [
  {
    title: 'EXPLORE',
    links: [
      { label: 'Sobre nós', href: '#sobre' },
      { label: 'Manuais', href: '#manuais' },
      { label: 'Serviços', href: '#por-quem-viveu' },
      { label: 'Conteúdos', href: '#conteudo' },
    ],
  },
  {
    title: 'CONTATO',
    links: [
      { label: 'E-mail', href: 'mailto:contato@sendasenior.com.br' },
      { label: 'WhatsApp', href: 'https://wa.me/' },
      { label: 'Agendar Conversa', href: '#contato' },
      { label: 'Instagram', href: INSTAGRAM_URL },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { label: 'Termos de Serviço', href: '/termos-de-servico' },
      { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
      { label: 'Política de Cookies', href: '/legal' },
      { label: 'Tratamento de Dados (LGPD)', href: '/politica-de-privacidade' },
    ],
  },
]

export type SocialLink = {
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
  href: string
  label: string
}

export const SOCIALS: SocialLink[] = [
  { Icon: Instagram, href: INSTAGRAM_URL, label: 'Instagram' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: WhatsAppIcon, href: 'https://wa.me/', label: 'WhatsApp' },
  { Icon: Facebook, href: '#', label: 'Facebook' },
]
