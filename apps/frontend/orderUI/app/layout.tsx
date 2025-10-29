import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BackgroundContainer, TabletContainer } from '@ai-assistant/components'
import ThemeProvider from './_components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Assistant - Order UI',
  description: 'AI Assistant Order Management Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <BackgroundContainer>
            <TabletContainer orientation="landscape">
              {children}
            </TabletContainer>
          </BackgroundContainer>
        </ThemeProvider>
      </body>
    </html>
  )
}

