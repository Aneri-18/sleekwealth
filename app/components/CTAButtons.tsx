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
    <div className={`flex w-full max-w-[440px] flex-wrap justify-center gap-3.5 ${className}`}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 basis-[170px] rounded-[16px] border border-cognac px-[22px] py-4 text-center font-satoshi text-[15px] tracking-[0.04em] text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)]"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopyEmail}
        className="flex-1 basis-[170px] rounded-[16px] border border-cognac px-[22px] py-4 text-center font-satoshi text-[15px] tracking-[0.04em] text-parchment transition-colors duration-300 hover:bg-[rgba(156,107,53,0.14)]"
      >
        {copied ? 'Email copied.' : 'Email'}
      </button>
    </div>
  )
}
