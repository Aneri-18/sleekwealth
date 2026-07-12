import type { Metadata } from "next";
import { Vollkorn } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Analytics from "./components/Analytics";
import CookieBanner from "./components/CookieBanner";
import { STORAGE_KEY } from "./lib/cookieConsent";

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const satoshi = localFont({
  variable: "--font-satoshi",
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      style: "normal",
      weight: "300 900",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
      weight: "300 900",
    },
  ],
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sleek Wealth — The Business of Luxury",
  description: "Sleek Wealth. The Business of Luxury.",
  openGraph: {
    title: "Sleek Wealth — The Business of Luxury",
    description: "Sleek Wealth. The Business of Luxury.",
    images: ["/images/og-card.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleek Wealth — The Business of Luxury",
    description: "Sleek Wealth. The Business of Luxury.",
    images: ["/images/og-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vollkorn.variable} ${satoshi.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-aubergine text-parchment font-satoshi min-h-screen">
        {/* A raw literal <script> (not next/script — that goes through Next's
            own RSC runtime bootstrap first, which is too late to beat first
            paint). The browser's HTML parser executes this synchronously as
            it parses <body>, before the banner below gets painted — if
            consent was already stored, it marks <html> so the CSS rule in
            globals.css hides the banner instantly instead of flashing it on
            every page load (this site navigates via full page loads, not
            client-side routing, so this check runs fresh on every request). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})){document.documentElement.setAttribute('data-cookie-consent','1')}}catch(e){}`,
          }}
        />
        {GA_MEASUREMENT_ID && <Analytics gaId={GA_MEASUREMENT_ID} />}
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
