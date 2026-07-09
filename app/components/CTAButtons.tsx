'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = '919987357331'
const WHATSAPP_MESSAGE =
  "Hi Aneri, I'd like to book a Discovery Call with Sleek Wealth."
const EMAIL = 'ops@sleekwealth.com'

interface CTAButtonsProps {
  className?: string
}

export default function CTAButtons({ className = '' }: CTAButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`

  return (
    <div className={`flex gap-4 ${className}`}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-sw border border-cognac px-6 py-4 text-center font-satoshi text-body-mobile text-parchment transition-colors hover:bg-cognac/10"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopyEmail}
        className="flex-1 rounded-sw border border-cognac px-6 py-4 text-center font-satoshi text-body-mobile text-parchment transition-colors hover:bg-cognac/10"
      >
        {copied ? 'Email copied.' : 'Email'}
      </button>
    </div>
  )
}
