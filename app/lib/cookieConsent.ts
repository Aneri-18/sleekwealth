// Plain constants shared between a Server Component (layout.tsx) and Client
// Components (CookieBanner, Analytics). Deliberately not in a 'use client'
// file — named value exports from a client module aren't reliable when
// imported by server-rendered code across the RSC boundary.
export const STORAGE_KEY = 'sw_cookie'
export const CONSENT_EVENT = 'sw-cookie-consent'
