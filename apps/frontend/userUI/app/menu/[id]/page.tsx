'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardMedia, 
  Grid, 
  Chip,
  IconButton,
  Divider
} from '@mui/material'
import { ArrowBack, Add, Remove } from '@mui/icons-material'
import { MenuItem, rawMenuSchema, RawMenuItem } from '../../../schemas'
import { useCart } from '../../_components/CartContext'
import menuData from '../../../menu.json'

export default function MenuItemPage() {
  const params = useParams()
  const router = useRouter()
  const { cartItems, increaseItem, decreaseItem, getItemCount, addToCart } = useCart()
  const menuItemId = params.id as string

  // Transform menu.json data to find the specific menu item
  const menuItem = useMemo(() => {
    const validatedMenu = rawMenuSchema.parse(menuData)
    
    for (const category of validatedMenu.menu.categories) {
      const item = category.items.find((item: RawMenuItem) => item.id === menuItemId)
      if (item) {
        return {
          id: item.id,
          name: item.ja_name,
          description: item.description,
          price: item.price,
          category: category.ja_name,
          isAvailable: true,
          thai_name: item.thai_name,
          imageUrl: `/imgs/menu-images/reguler-menues/${item.id}.jpg`,
          categoryId: category.id,
          categoryName: category.name,
          categoryThaiName: category.thai_name,
        } as MenuItem & { categoryId: string, categoryName: string, categoryThaiName: string }
      }
    }
    return null
  }, [menuItemId])

  if (!menuItem) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          メニューアイテムが見つかりません
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.back()}
          startIcon={<ArrowBack />}
        >
          戻る
        </Button>
      </Box>
    )
  }

  const currentQuantity = getItemCount(menuItemId)

  const handleIncrease = () => {
    console.log('handleIncrease called:', { currentCartItems: cartItems })
    increaseItem(menuItem)
  }

  const handleDecrease = () => {
    console.log('handleDecrease called:', { currentCartItems: cartItems })
    if (cartItems[menuItem.id]) {
      decreaseItem(menuItemId)
    }
  }

  const handleAddToCart = () => {
    console.log('handleAddToCart called:', { currentCartItems: cartItems })
    addToCart(menuItem)
    // Navigate back to menu page after adding to cart
    router.push('/menu')
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => router.back()}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {menuItem.name}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        {/* Image */}
        <Card sx={{ overflow: 'hidden', mb: 3 }}>
          <CardMedia
            component="img"
            height="400"
            image={menuItem.imageUrl}
            alt={menuItem.name}
            sx={{ objectFit: 'cover' }}
          />
        </Card>

        {/* Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Names */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              {menuItem.name}
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              {menuItem.thai_name}
            </Typography>
            <Chip 
              label={menuItem.categoryName} 
              variant="outlined" 
              size="small"
              sx={{ mb: 2 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          {menuItem.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {menuItem.description}
              </Typography>
            </Box>
          )}

          {/* Price */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ¥{menuItem.price.toLocaleString()}
            </Typography>
          </Box>

          {/* Quantity controls */}
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">数量</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleDecrease}
                  disabled={currentQuantity === 0}
                  sx={{ 
                    minWidth: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  <Remove />
                </Button>
                <Typography variant="h4" sx={{ minWidth: '60px', textAlign: 'center', fontWeight: 'bold' }}>
                  {currentQuantity}
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleIncrease}
                  sx={{ 
                    minWidth: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  <Add />
                </Button>
              </Box>
            </Box>

            {/* Add to cart button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              sx={{ py: 1.5 }}
            >
              カートに追加
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
