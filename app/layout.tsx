import type { Metadata } from "next";
import { Vollkorn } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

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

export const metadata: Metadata = {
  title: "Sleek Wealth — The Business of Luxury",
  description: "Sleek Wealth. The Business of Luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${vollkorn.variable} ${satoshi.variable}`}>
      <body className="bg-aubergine text-parchment font-satoshi min-h-screen">
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
