import { Box, BoxProps } from '@mui/material'
import { ReactNode } from 'react'

interface TabletContainerProps extends BoxProps {
  children: ReactNode
  maxWidth?: number | string
  centered?: boolean
  safeArea?: boolean
  backgroundColor?: string
  borderRadius?: number | string
  shadow?: boolean
  orientation?: 'portrait' | 'landscape'
}

export default function TabletContainer({ 
  children, 
  maxWidth, 
  centered = true,
  safeArea = true,
  backgroundColor = '#f5f5f5',
  borderRadius = 0,
  shadow = false,
  orientation = 'portrait',
  ...props 
}: TabletContainerProps) {
  // iPad 6 dimensions:
  // Portrait: 768 x 1024
  // Landscape: 1024 x 768
  const defaultMaxWidth = orientation === 'landscape' ? '1024px' : '768px'
  const containerMaxWidth = maxWidth || defaultMaxWidth

  return (
    <Box sx={{ 
      height: '100%', 
      maxHeight: '100%',
      width: typeof containerMaxWidth === 'number' ? `${containerMaxWidth}px` : containerMaxWidth,
      maxWidth: '100dvw',
      bgcolor: 'white', 
      position: 'relative', 
      overflowY: 'auto',
      overflowX: 'hidden',
      borderRadius: 0,
      boxShadow: shadow ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
      // Tablet-optimized scrollbar (slightly larger than mobile for better touch targets)
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.15)',
        borderRadius: '4px',
        border: '1px solid transparent',
        backgroundClip: 'content-box',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0, 0, 0, 0.25)',
        backgroundClip: 'content-box',
      },
      '&::-webkit-scrollbar-thumb:active': {
        background: 'rgba(0, 0, 0, 0.35)',
        backgroundClip: 'content-box',
      },
      // Firefox scrollbar
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0, 0, 0, 0.15) transparent',
      // Smooth scrolling
      scrollBehavior: 'smooth',
      // Touch scrolling optimization
      WebkitOverflowScrolling: 'touch',
      ...props.sx
    }}
    {...props}>
      {children}
    </Box>
  )
}

