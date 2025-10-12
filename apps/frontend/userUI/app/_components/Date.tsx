import React from 'react'
import { Box, Typography } from '@mui/material'

interface DateProps {
  date: string
  time: string
}

export default function Date({ date, time }: DateProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      mb: 2
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {date}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {time}
      </Typography>
    </Box>
  )
}
