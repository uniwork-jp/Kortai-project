'use client'

import { useState, useMemo, useEffect } from 'react'
import { Box, Typography, Grid, Button, Fab, Badge } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShoppedContainer from '../_components/ShoppedContainer'
import CategoryContainer from '../_components/CategoryContainer'
import { MenuItem, Category, rawMenuSchema, RawMenuCategory, RawMenuItem } from '../../zod'
import { useCart } from '../_components/CartContext'
import menuData from '../../menu.json'
import menuImages from '../../menuImages.json'
import { useRouter } from 'next/navigation'

export default function Menu() {
  const { getTotalItems } = useCart()
  const router = useRouter()

  // Transform menu.json data to match our component structure
  const { categories, menuItems } = useMemo(() => {
    // Validate raw menu data
    const validatedMenu = rawMenuSchema.parse(menuData)
    
    const categories: Category[] = validatedMenu.menu.categories.map((category: RawMenuCategory) => ({
      id: category.id,
      title: category.ja_name,
      imageUrl: category.imageUrl,
      price: calculateAveragePrice(category.items), 
      name: category.name,
      thai_name: category.thai_name,
      ja_name: category.ja_name
    }))

    const menuItems: Record<string, MenuItem[]> = {}
    validatedMenu.menu.categories.forEach((category: RawMenuCategory) => {
      menuItems[category.id] = category.items.map((item: RawMenuItem) => ({
        id: item.id,
        name: item.ja_name,
        description: item.description,
        price: item.price,
        category: category.ja_name,
        isAvailable: true,
        thai_name: item.thai_name,
        pictureUri: menuImages[item.id as keyof typeof menuImages] || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
      }))
    })

    console.log('Validated menu:', validatedMenu)
    console.log('Created categories:', categories)
    console.log('Created menuItems:', menuItems)

    return { categories, menuItems }
  }, [])


  // Helper function to calculate average price for category
  function calculateAveragePrice(items: any[]): number {
    if (items.length === 0) return 0
    const total = items.reduce((sum, item) => sum + item.price, 0)
    return Math.round(total / items.length)
  }


  const handleCartClick = () => {
    router.push('/confirm')
  }

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        メニュー一覧
      </Typography>
      
      {/* ShoppedContainer at top */}
      <Box sx={{ mb: 4 }}>
        <ShoppedContainer menuItems={menuItems} />
      </Box>
      
      {/* CategoryContainers for each category */}
      <Box sx={{ mb: 4 }}>
        {categories.map((category) => (
          <Box key={category.id} sx={{ mb: 4 }}>
            <CategoryContainer menuItems={menuItems} category={category} />
          </Box>
        ))}
      </Box>

      {/* Floating Cart Button */}
      <Fab
        color="primary"
        aria-label="cart"
        onClick={handleCartClick}
        disabled={getTotalItems() === 0}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 'calc(50vw - 230px + 24px)', // Center within mobile container (460px/2 = 230px)
          zIndex: 1000,
          '@media (max-width: 460px)': {
            right: 24, // Fallback for smaller screens
          }
        }}
      >
        <Badge badgeContent={getTotalItems()} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>
    </Box>
  )
}
