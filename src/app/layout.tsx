import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { site } from "@/config/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Aurelia Estates — Architectural Residences in India & the USA",
    template: "%s · Aurelia Estates",
  },
  description: site.description,
  keywords: ["luxury real estate", "penthouses", "private villas", "Mumbai", "Miami", "luxury residences", "Aurelia Estates"],
  openGraph: {
    type: "website",
    siteName: "Aurelia Estates",
    title: "Aurelia Estates — Where light becomes architecture",
    description: site.description,
    images: [{ url: "/images/hero-render-day.jpg", width: 1568, height: 882, alt: "Travertine residence with infinity pool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurelia Estates",
    description: site.description,
    images: ["/images/hero-render-day.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eee5" },
    { media: "(prefers-color-scheme: dark)", color: "#11100e" },
  ],
  width: "device-width",
  initialScale: 1,
};

const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('aurelia-theme');if(t==='night'){d.dataset.theme='night'}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="day" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-[var(--fg)] focus:px-4 focus:py-2 focus:text-[var(--bg)]"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
