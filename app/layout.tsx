import type { Metadata } from "next";
import { Vollkorn } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
