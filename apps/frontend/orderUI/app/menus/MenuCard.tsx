'use client'

import { 
  Box,
  Button,
  Typography,
  Card,
  CardContent,
} from '@mui/material'
import { useOrder } from '../_components/OrderContext'

type MenuItem = {
  id: string
  ja_name: string
  thai_name: string
  name: string
  description?: string
  price: number
  category?: {
    id: string
    ja_name: string
    thai_name: string
    name: string
  }
}

type MenuCardProps = {
  item: MenuItem
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addMenu, removeMenu, menus } = useOrder()

  // Find the current quantity for this menu item
  const menuItem = menus.find(m => m.menuId === item.id)
  const clickCount = menuItem?.quantity || 0

  const handleAddClick = () => {
    addMenu(item.id, item.price, 1, item.ja_name, item.thai_name)
  }

  const handleClearClick = () => {
    removeMenu(item.id)
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {item.ja_name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" display="block" sx={{ mb: 2 }}>
          {item.thai_name}
        </Typography>
        
        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
          ¥{item.price.toLocaleString()}
        </Typography>
        
        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 1, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearClick}
            disabled={clickCount === 0}
            sx={{
              flex: 1,
            }}
          >
            <Typography variant="h5" fontWeight="bold"
            >
              削除
            </Typography>
          </Button>
          <Button
            variant={clickCount > 0 ? "contained" : "outlined"}
            onClick={handleAddClick}
            color={clickCount > 0 ? "success" : "primary"}
            sx={{
              flex: 1,
            }}
          >
             <Typography variant="h5" fontWeight="bold">
            {clickCount > 0 ? (
              `${clickCount}`
            ) : (
              '追加'
            )}
            </Typography>
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

