'use client'

import React from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Paper,
  Alert,
  Chip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HomeIcon from '@mui/icons-material/Home'
import { useRouter } from 'next/navigation'
import { useDateTime } from '../_components/DateTimeContext'
import { useCart } from '../_components/CartContext'
import { useMemo } from 'react'

export default function ReservationsPage() {
  const router = useRouter()
  const { dateTime } = useDateTime()
  const { cartItems } = useCart()

  // Calculate reserved menu data
  const { totalAmount, menuNames, totalItems } = useMemo(() => {
    const items = Object.values(cartItems)
    const totalAmount = items.reduce((sum, item) => sum + (item.menuItem.price * item.amount), 0)
    const totalItems = items.reduce((sum, item) => sum + item.amount, 0)
    const menuNames = items.map(item => `${item.menuItem.name} × ${item.amount}`).join(', ')
    
    return { totalAmount, menuNames, totalItems }
  }, [cartItems])

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Reserved Menu Items */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            予約詳細
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {menuNames || 'メニューがありません'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>ご注意:</strong><br />
          • 予約時間の15分前までにご来店ください<br />
          • キャンセルは予約時間の2時間前までにお願いします<br />
          • お支払いは店舗にて現金またはカードでお願いします
        </Typography>
      </Alert>

      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
          sx={{ minWidth: 200 }}
        >
          ホームに戻る
        </Button>
      </Box>

      {/* Footer Information */}
      <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          ご質問がございましたら、店舗までお気軽にお問い合わせください。
        </Typography>
      </Paper>
    </Box>
  )
}
