'use client'

import { useState, useMemo } from 'react'
import { Box, Typography, Grid, Button } from '@mui/material'
import ShoppedContainer from '../_components/ShoppedContainer'
import CategoryContainer from '../_components/CategoryContainer'
import { MenuItem, Category, rawMenuSchema, RawMenuCategory, RawMenuItem } from '../../zod'
import { useCart } from '../_components/CartContext'
import menuData from '../../menu.json'
import menuImages from '../../menuImages.json'

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { cartItems, updateQuantity, getItemCount } = useCart()

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


  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleQuantityChange = (item: MenuItem, quantity: number) => {
    updateQuantity(item.id, quantity)
  }

  const getCategoryCartCount = (categoryId: string) => {
    const items = menuItems[categoryId] || []
    return items.reduce((total, item) => total + getItemCount(item.id), 0)
  }

  return (
    <Box sx={{ p: 3 }}>
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
    </Box>
  )
}
