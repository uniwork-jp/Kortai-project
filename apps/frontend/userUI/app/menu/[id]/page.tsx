'use client'

import { useState, useMemo } from 'react'
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
import { MenuItem, rawMenuSchema, RawMenuCategory, RawMenuItem } from '../../../zod'
import { useCart } from '../../_components/CartContext'
import menuData from '../../../menu.json'
import menuImages from '../../../menuImages.json'

export default function MenuItemPage() {
  const params = useParams()
  const router = useRouter()
  const { cartItems, updateQuantity, getItemCount } = useCart()
  const menuItemId = params.id as string

  // Transform menu.json data to find the specific menu item
  const menuItem = useMemo(() => {
    const validatedMenu = rawMenuSchema.parse(menuData)
    
    for (const category of validatedMenu.menu.categories) {
      const item = category.items.find(item => item.id === menuItemId)
      if (item) {
        return {
          id: item.id,
          name: item.ja_name,
          description: item.description,
          price: item.price,
          category: category.ja_name,
          isAvailable: true,
          thai_name: item.thai_name,
          pictureUri: menuImages[item.id as keyof typeof menuImages] || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
          categoryId: category.id,
          categoryName: category.name,
          categoryThaiName: category.thai_name
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

  const currentQuantity = getItemCount(menuItem.id)

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(menuItem.id, newQuantity)
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
            image={menuItem.pictureUri}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  onClick={() => handleQuantityChange(Math.max(0, currentQuantity - 1))}
                  disabled={currentQuantity === 0}
                  color="primary"
                >
                  <Remove />
                </IconButton>
                <Typography variant="h6" sx={{ minWidth: '40px', textAlign: 'center' }}>
                  {currentQuantity}
                </Typography>
                <IconButton 
                  onClick={() => handleQuantityChange(currentQuantity + 1)}
                  color="primary"
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>

            {/* Add to cart button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => handleQuantityChange(currentQuantity + 1)}
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
