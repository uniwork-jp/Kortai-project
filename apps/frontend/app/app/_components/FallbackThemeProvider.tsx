'use client'

import React from 'react'

// Simple fallback theme provider without MUI dependencies
export default function FallbackThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#000000'
    }}>
      {children}
    </div>
  )
}
