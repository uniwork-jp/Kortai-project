'use client'

import { 
  Typography, 
  Box,
  Button,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DateForm from './_components/DateTimeForm'
import { useCart } from './_components/CartContext'
import { useDateTime } from './_components/DateTimeContext'

export default function HomePage() {
  const router = useRouter()
  const { getTotalItems } = useCart()
  const { dateTime } = useDateTime()

  // Check if we have both date/time and cart items, then redirect to confirm
  useEffect(() => {
    const hasDateTime = dateTime.date && dateTime.time
    const hasCartItems = getTotalItems() > 0
    
    if (hasDateTime && hasCartItems) {
      router.push('/confirm')
    }
  }, [dateTime.date, dateTime.time, getTotalItems, router])

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
