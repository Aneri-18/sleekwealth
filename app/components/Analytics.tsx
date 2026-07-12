'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CONSENT_EVENT, STORAGE_KEY } from '../lib/cookieConsent'

interface AnalyticsProps {
  gaId: string
}

export default function Analytics({ gaId }: AnalyticsProps) {
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const check = () => setAccepted(localStorage.getItem(STORAGE_KEY) === 'accepted')
    check()
    window.addEventListener(CONSENT_EVENT, check)
    window.addEventListener('storage', check)
    return () => {
      window.removeEventListener(CONSENT_EVENT, check)
      window.removeEventListener('storage', check)
    }
  }, [])

  if (!accepted) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
