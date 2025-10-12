"use client"

import { Box } from '@mui/material'

interface DateBadgeProps {
  date?: string
}

export default function DateBadge({ date = "SUN, 10/28" }: DateBadgeProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      my: 2,
    }}>
      <Box sx={{ 
        bgcolor: 'rgba(128, 128, 128, 0.8)', 
        color: 'white', 
        px: 2, 
        py: 0.5, 
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 'medium'
      }}>
        {date}
      </Box>
    </Box>
  )
}
