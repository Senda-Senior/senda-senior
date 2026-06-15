/**
 * WhatsAppFloat.tsx
 * Botão flutuante WhatsApp — ícone fixo com hover scale, link para wa.me
 *
 * Conecta: nenhum | posiciona-se fixo no viewport
 * Camada: browser
 */
'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Senda pelo WhatsApp"
      className="whatsapp-float inline-flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-[var(--color-white-90)] bg-[var(--color-whatsapp)] text-white shadow-[0_12px_28px_var(--color-black-26)] transition-[transform,box-shadow] duration-[200ms] ease-[ease] hover:-translate-y-[2px] hover:scale-[1.03] hover:shadow-[0_16px_34px_var(--color-black-30)]"
      style={{ boxShadow: '0 14px 34px rgba(42, 37, 32, 0.28)' }}
    >
      <MessageCircle size={30} strokeWidth={2} />
    </Link>
  )
}
