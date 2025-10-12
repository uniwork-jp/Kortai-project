import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BackgroundContainer, MobileContainer } from '@ai-assistant/components'
import ThemeProvider from './_components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Assistant',
  description: 'AI Assistant Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <BackgroundContainer>
            <MobileContainer>
              {children}
            </MobileContainer>
          </BackgroundContainer>
        </ThemeProvider>
      </body>
    </html>
  )
}
