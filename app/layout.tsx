/* eslint-disable import/order */
import { Outfit } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
/* eslint-enable import/order */

import { AI } from './action'
import { Providers } from './providers'

import '@/app/globals.css'

export const metadata = {
  title: 'Moraa',
  description: 'Moraa is a platform for learning and teaching online.',
}

const outfit = Outfit({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.className}>
      <body className="h-full w-full scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-white scrollbar-track-rounded-full bg-background text-foreground">
        <AI>
          <Providers>{children}</Providers>
        </AI>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
