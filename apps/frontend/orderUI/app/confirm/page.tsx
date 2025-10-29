'use client'

import React from 'react'
import { 
  Typography, 
  Box,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useOrder } from '../_components/OrderContext'

export default function ConfirmPage() {
  const router = useRouter()
  const { menus, total, clearMenus } = useOrder()

  const handleReturn = () => {
    router.push('/menus')
  }

  const handleClear = () => {
    clearMenus()
    router.push('/menus')
  }

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        ご注文確認 / ยืนยันคำสั่งซื้อ
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          注文内容 / รายการสั่งซื้อ
        </Typography>
        
        {menus.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            注文がありません / ไม่มีรายการสั่งซื้อ
          </Typography>
        ) : (
          <List>
            {menus.map((menu, index) => (
              <React.Fragment key={menu.menuId}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="medium">
                        {menu.japanese} ({menu.thai_name})
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>¥{menu.price.toLocaleString()} ×</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{menu.quantity}</span>
                      </Typography>
                    }
                  />
                  <Typography variant="body1" fontWeight="bold" sx={{ minWidth: '80px', textAlign: 'right' }}>
                    ¥{(menu.price * menu.quantity).toLocaleString()}
                  </Typography>
                </ListItem>
                {index < menus.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6" fontWeight="bold">
            合計 / รวม
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">
            ¥{total.price.toLocaleString()}
          </Typography>
        </Box>
      </Paper>

      <Stack direction="row" spacing={2} justifyContent="center">
      <Button
          variant="contained"
          onClick={handleReturn}
          sx={{ minWidth: '150px' }}
        >
          戻る / กลับ
        </Button>
        <Button
          variant="outlined"
          onClick={handleClear}
          sx={{ minWidth: '150px' }}
        >
          クリア / ล้าง
        </Button>

      </Stack>
    </Box>
  )
}

