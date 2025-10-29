'use client'

import { 
  Typography, 
  Box,
} from '@mui/material'

export default function HomePage() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      height: '100%'
    }}>
      <Typography variant="h4">
        Order UI
      </Typography>
      <Typography variant="body1">
        Welcome to the Order Management Interface
      </Typography>
    </Box>
  )
}

