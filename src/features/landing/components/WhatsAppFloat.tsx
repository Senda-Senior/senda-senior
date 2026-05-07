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
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 120,
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: '#25D366',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 28px rgba(0,0,0,0.26)',
        border: '2px solid rgba(255,255,255,0.9)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'
        e.currentTarget.style.boxShadow = '0 16px 34px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.26)'
      }}
    >
      <MessageCircle size={28} strokeWidth={2.2} />
    </Link>
  )
}
