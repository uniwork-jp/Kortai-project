import { Box, BoxProps } from '@mui/material'
import { ReactNode } from 'react'

interface MobileContainerProps extends BoxProps {
  children: ReactNode
  maxWidth?: number | string
  centered?: boolean
  safeArea?: boolean
  backgroundColor?: string
  borderRadius?: number | string
  shadow?: boolean
}

export default function MobileContainer({ 
  children, 
  maxWidth = '460px', 
  centered = true,
  safeArea = true,
  backgroundColor = '#f5f5f5',
  borderRadius = 0,
  shadow = false,
  ...props 
}: MobileContainerProps) {
  return (
    <Box sx={{ 
      height: '100%', 
      maxHeight: '100%',
      width: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      maxWidth: '100dvw',
      bgcolor: 'white', 
      position: 'relative', 
      overflowY: 'auto',
      overflowX: 'hidden',
      borderRadius: 0,
      boxShadow: shadow ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
      // Mobile-optimized scrollbar
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.15)',
        borderRadius: '3px',
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
