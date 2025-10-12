"use client"

import { Box } from '@mui/material'

interface ChatContainerProps {
  children: React.ReactNode
  backgroundColor?: string
}

export default function ChatContainer({ 
  children, 
  backgroundColor = 'rgb(113, 147, 193)' 
}: ChatContainerProps) {
  return (
    <Box sx={{ 
      height: '100%', 
      minHeight: '100vh',
      bgcolor: backgroundColor, 
      position: 'relative', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {children}
    </Box>
  )
}
