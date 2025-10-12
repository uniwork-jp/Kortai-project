'use client'

import React, { useMemo } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  IconButton
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCart } from '../_components/CartContext'
import { useDateTime } from '../_components/DateTimeContext'
import { MenuItem } from '../../zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const { cartItems, removeFromCart, clearCart, getTotalItems } = useCart()
  const { dateTime } = useDateTime()
  const router = useRouter()

  // Calculate totals
  const { totalPrice, totalItems, itemDetails } = useMemo(() => {
    const items = Object.values(cartItems)
    const totalItems = items.reduce((sum, item) => sum + item.amount, 0)
    const totalPrice = items.reduce((sum, item) => sum + (item.menuItem.price * item.amount), 0)
    
    const itemDetails = items.map(item => ({
      ...item.menuItem,
      quantity: item.amount,
      subtotal: item.menuItem.price * item.amount
    }))

    return { totalPrice, totalItems, itemDetails }
  }, [cartItems])

  const handleConfirmOrder = () => {
    // TODO: Implement order confirmation logic
    console.log('Order confirmed:', { cartItems, totalPrice, totalItems })
    
    // Clear cart after confirmation
    clearCart()
    
    // Show success message or redirect
    alert('注文が確定しました！ありがとうございます。')
    
    // Redirect to menu page
    router.push('/menu')
  }

  const handleCancelOrder = () => {
    if (confirm('注文をキャンセルしますか？カートの内容は削除されます。')) {
      clearCart()
      router.push('/menu')
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
  }

  if (totalItems === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Link href="/menu">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h5" sx={{ ml: 1 }}>
            注文確認
          </Typography>
        </Box>
        
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            カートが空です
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            メニューから商品を選択してから注文確認に戻ってください
          </Typography>
          <Link href="/menu">
            <Button variant="contained" size="large">
              メニューに戻る
            </Button>
          </Link>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Link href="/menu">
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Typography variant="h5" sx={{ ml: 1 }}>
          注文確認
        </Typography>
      </Box>

      {/* Date and Time Display */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            注文日時
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              日付: {dateTime.date || '未設定'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              時間: {dateTime.time || '未設定'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              注文内容の確認
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            以下の内容で注文を確定します。内容をご確認ください。
          </Typography>

          {/* Order Items */}
          <List sx={{ mb: 2 }}>
            {itemDetails.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.pictureUri}
                      alt={item.name}
                      sx={{ width: 60, height: 60 }}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <IconButton 
                          onClick={() => handleRemoveItem(item.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip 
                            label={item.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Typography variant="body2" color="text.secondary">
                            数量: {item.quantity}個
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          ¥{item.subtotal.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < itemDetails.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Total Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              商品数
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {totalItems}個
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              合計金額
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              ¥{totalPrice.toLocaleString()}
            </Typography>
          </Box>

          {/* Tax Information */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              価格は税込表示です。サービス料は含まれていません。
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          size="large"
          onClick={handleCancelOrder}
          sx={{ minWidth: 120 }}
        >
          キャンセル
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirmOrder}
          sx={{ minWidth: 120 }}
        >
          注文確定
        </Button>
      </Box>

      {/* Additional Information */}
      <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          注文確定後、店舗で準備が完了次第お知らせいたします。
        </Typography>
      </Paper>
    </Box>
  )
}
