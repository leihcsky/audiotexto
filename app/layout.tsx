import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader, Outfit } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getConfig } from "@/lib/config";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME } from "@/lib/site-copy";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const config = getConfig();
  return {
    metadataBase: new URL(config.siteUrl),
    title: {
      default: HOME_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: HOME_DESCRIPTION,
    applicationName: SITE_NAME,
    robots: { index: true, follow: true },
    // Stable public URLs (not hashed) so Google Search / GSC can fetch the favicon.
    // Formats: ICO + PNG ≥48px square — SVG alone is not enough for Google SERP icons.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      siteName: SITE_NAME,
      locale: "es",
      type: "website",
      images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE_NAME }],
    },
    verification: config.googleSiteVerification
      ? { google: config.googleSiteVerification }
      : undefined,
  };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const config = getConfig();

  return (
    <html lang="es" className={`${outfit.variable} ${newsreader.variable}`}>
      <body className="min-h-screen antialiased">
        <Analytics measurementId={config.gaMeasurementId} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <div id="contenido">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
