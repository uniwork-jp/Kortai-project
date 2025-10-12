'use client'

import { 
  Typography, 
  Box,
  Button,
} from '@mui/material'
import Link from 'next/link'
import Date from './_components/Date'

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
      <Date date="2024-01-15" time="14:30" />
      <Link href="/menu">
        <Button variant="contained">
          Menu
        </Button>
      </Link>
    </Box>
  )
}
