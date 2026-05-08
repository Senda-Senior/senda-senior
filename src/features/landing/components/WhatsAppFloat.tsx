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
      className="fixed right-[20px] bottom-[20px] z-[120] inline-flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 border-[rgba(255,255,255,0.9)] bg-[#25D366] text-white shadow-[0_12px_28px_rgba(0,0,0,0.26)] transition-[transform,box-shadow] duration-[200ms] ease-[ease] hover:-translate-y-[2px] hover:scale-[1.03] hover:shadow-[0_16px_34px_rgba(0,0,0,0.3)]"
    >
      <MessageCircle size={28} strokeWidth={2.2} />
    </Link>
  )
}
