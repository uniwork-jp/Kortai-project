'use client'

import { 
  Typography, 
  Box,
  Button,
} from '@mui/material'
import Link from 'next/link'

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
        top
      </Typography>
      <Link href="/menu">
        <Button variant="contained">
          Menu
        </Button>
      </Link>
    </Box>
  )
}
