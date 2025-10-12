import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  IconButton,
  Chip,
  Paper,
  Button
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import { useCart } from './CartContext'
import { MenuItem } from '../../zod'
import Link from 'next/link'

interface ShoppedContainerProps {
  menuItems: Record<string, MenuItem[]>
}

export default function ShoppedContainer({ menuItems }: ShoppedContainerProps) {
  const { cartItems, removeFromCart, updateQuantity, getItemCount, getTotalItems } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Get all menu items as flat array and filter only items in cart
  const allMenuItems: MenuItem[] = Object.values(menuItems).flat()
  const cartedItems: MenuItem[] = allMenuItems.filter(item => getItemCount(item.id) > 0)
  
  if (cartedItems.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          カートは空です
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          メニューから商品を選択してください
        </Typography>
      </Paper>
    )
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? cartedItems.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === cartedItems.length - 1 ? 0 : prev + 1
    )
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    if (currentIndex >= cartedItems.length - 1) {
      setCurrentIndex(Math.max(0, cartedItems.length - 2))
    }
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const currentItem = cartedItems[currentIndex]
  const currentQuantity = getItemCount(currentItem.id)

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ショッピングカート ({getTotalItems()}個)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} / {cartedItems.length}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {/* Navigation buttons */}
        {cartedItems.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'white',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'white',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}

        {/* Current item card */}
        <Card sx={{ maxWidth: 400, mx: 'auto' }}>
          {currentItem.imageUrl && (
            <CardMedia
              component="img"
              height="200"
              image={currentItem.imageUrl}
              alt={currentItem.name}
              sx={{ objectFit: 'cover' }}
            />
          )}
          
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {currentItem.name}
              </Typography>
              <IconButton 
                onClick={() => handleRemoveItem(currentItem.id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            {currentItem.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentItem.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              <Chip 
                label={currentItem.category} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
              {currentItem.tags?.map((tag: string, index: number) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                ¥{currentItem.price.toLocaleString()}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuantityChange(currentItem.id, currentQuantity - 1)}
                  disabled={currentQuantity <= 1}
                >
                  -
                </Button>
                <Typography variant="body1" sx={{ minWidth: '30px', textAlign: 'center' }}>
                  {currentQuantity}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuantityChange(currentItem.id, currentQuantity + 1)}
                >
                  +
                </Button>
              </Box>
            </Box>

            {currentItem.allergens && currentItem.allergens.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  アレルギー: {currentItem.allergens.join(', ')}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Carousel indicators */}
      {cartedItems.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
          {cartedItems.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            />
          ))}
        </Box>
      )}

      {/* Checkout Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Link href="/confirm">
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartCheckoutIcon />}
            sx={{
              minWidth: 200,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            注文確認へ
          </Button>
        </Link>
      </Box>
    </Paper>
  )
}
