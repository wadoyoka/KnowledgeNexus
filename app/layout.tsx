import HeaderCreator from "@/components/Header/HeaderCreator";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


const description = "KnowledgeNexusは知識を管理する統合型データベースです"

export const metadata: Metadata = {
  title: {
    default: 'KnowledgeNexus',
    template: '%s | KnowledgeNexus',
  },
  description: `${description}`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://example.com'),
  openGraph: {
    title: {
      default: 'KnowledgeNexus',
      template: '%s | KnowledgeNexus',
    },
    description: `${description}`,
    url: '/',
    siteName: 'KnowledgeNexus',
    images: [
      {
        url: '/ogp/og-image.webp',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: 'KnowledgeNexus',
      template: '%s | KnowledgeNexus',
    },
    description: `${description}`,
    images: [{
      url: '/ogp/og-image.webp',
      width: 1200,
      height: 630,
    },],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicons/site.webmanifest',
  applicationName: 'KnowledgeNexus',
  keywords: ['tech', 'web development', 'knowledge', 'KnowledgeNexus', 'Nexus'],
  authors: [{ name: 'KnowledgeNexus' }],
  creator: 'KnowledgeNexus',
  publisher: 'KnowledgeNexus',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <HeaderCreator />
          <main>
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
