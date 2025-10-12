'use client'

import { 
  Typography, 
  Box,
  Button,
} from '@mui/material'
import Link from 'next/link'
import DateForm from './_components/DateTimeForm'

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
        クワタイ事前予約
      </Typography>
      <DateForm 
        onDateTimeChange={(dateTime) => console.log('Selected:', dateTime)}
      />
      <Link href="/menu">
        <Button variant="contained">
          メニュー選択へ
        </Button>
      </Link>
    </Box>
  )
}
