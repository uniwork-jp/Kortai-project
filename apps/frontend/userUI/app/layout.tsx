import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BackgroundContainer, MobileContainer } from '@ai-assistant/components'
import ThemeProvider from './_components/ThemeProvider'
import { DateTimeProvider } from './_components/DateTimeContext'
import { CartProvider } from './_components/CartContext'

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
          <DateTimeProvider initialDate="2024-01-15" initialTime="14:30">
            <CartProvider>
              <BackgroundContainer>
                <MobileContainer>
                  {children}
                </MobileContainer>
              </BackgroundContainer>
            </CartProvider>
          </DateTimeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
