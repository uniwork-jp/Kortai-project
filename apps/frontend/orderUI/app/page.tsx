'use client'

import { 
  Typography, 
  Box,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/menus')
  }, [router])

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        Loading...
      </Typography>
    </Box>
  )
}

