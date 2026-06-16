/**
 * /settings — rota legada.
 * A página real de configurações é `/configuracoes` (ver src/features/configuracoes).
 * Este stub antigo só tinha botões sem ação; mantemos um redirect permanente para não
 * quebrar links/bookmarks antigos.
 */
import { redirect } from 'next/navigation'

export default function SettingsRedirect() {
  redirect('/configuracoes')
}
