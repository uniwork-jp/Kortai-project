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

  const backgroundImage = `/imgs/menu-images/reguler-menues/${item.id}.jpg`

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
          color: 'white'
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
            fontSize: '1.3rem',
            mb: 1
          }}
        >
          {item.ja_name}
        </Typography>
        
        <Typography 
          variant="body1" 
          display="block" 
          sx={{ 
            mb: 2, 
            color: 'white',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
            fontWeight: 500
          }}
        >
          {item.thai_name}
        </Typography>
      
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              fontSize: '1.5rem'
            }}
          >
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
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              '&.Mui-disabled': {
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.3)',
              }
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              削除
            </Typography>
          </Button>
          <Button
            variant={clickCount > 0 ? "contained" : "outlined"}
            onClick={handleAddClick}
            color={clickCount > 0 ? "success" : "primary"}
            sx={{
              flex: 1,
              ...(clickCount === 0 && {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              })
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ color: clickCount > 0 ? 'inherit' : 'white' }}>
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

