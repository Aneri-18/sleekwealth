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
    <div className={`flex w-full flex-nowrap justify-start gap-2.5 ${className}`}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-[22px] border border-cognac px-4 py-2 text-center font-satoshi text-[13px] tracking-[0.04em] text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)]"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopyEmail}
        className="rounded-[22px] border border-cognac px-4 py-2 text-center font-satoshi text-[13px] tracking-[0.04em] text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)]"
      >
        {copied ? 'Email copied.' : 'Email'}
      </button>
    </div>
  )
}
