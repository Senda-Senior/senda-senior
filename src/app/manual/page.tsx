/**
 * manual/page.tsx
 * Rota legada do leitor de manual pago — redireciona para conteúdos públicos.
 * Não expor capítulos do produto sem entitlement.
 *
 * Camada: server
 */

import { redirect } from 'next/navigation'

export default function ManualIndex() {
  redirect('/#conteudo')
}
