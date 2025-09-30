import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-US" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AuthProvider>
          <div id="root" className="h-full">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}