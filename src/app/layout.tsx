import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sentence Builder Game - Master English Grammar',
  description: 'Interactive 45-level grammar learning game for ESOL students. Master English sentence structure through gamified learning with comprehensive grammar validation.',
  keywords: [
    'ESOL',
    'English grammar',
    'sentence building',
    'grammar game',
    'English learning',
    'ESL',
    'grammar practice',
    'sentence structure',
    'present perfect',
    'past tense',
    'future tense',
    'question formation'
  ],
  authors: [{ name: 'Sentence Builder Team' }],
  creator: 'Sentence Builder Team',
  publisher: 'Sentence Builder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sentence-builder-game.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sentence Builder Game - Master English Grammar',
    description: 'Interactive 45-level grammar learning game for ESOL students. Master English sentence structure through gamified learning.',
    url: 'https://sentence-builder-game.vercel.app',
    siteName: 'Sentence Builder Game',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sentence Builder Game - Master English Grammar',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentence Builder Game - Master English Grammar',
    description: 'Interactive 45-level grammar learning game for ESOL students.',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  )
}