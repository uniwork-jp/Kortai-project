'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import ThemeProvider to avoid chunk loading issues
const ThemeProvider = dynamic(() => import('./ThemeProvider'), {
  ssr: false,
  loading: () => <div>Loading theme...</div>
})

// Fallback theme provider
const FallbackThemeProvider = dynamic(() => import('./FallbackThemeProvider'), {
  ssr: false
})

// Dynamically import ErrorBoundary
const ErrorBoundary = dynamic(() => import('./ErrorBoundary'), {
  ssr: false
})

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  )
}
