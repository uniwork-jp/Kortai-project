"use client"

import { Box } from '@mui/material'

interface TalkContainerProps {
  children: React.ReactNode
}

export default function TalkContainer({ children }: TalkContainerProps) {
  return (
    <Box 
      className="talk-container"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'space-between',
        height: '100%',
        width: '100%',
        px: 2,
      }}
    > 
      {children}
    </Box>
  )
}
