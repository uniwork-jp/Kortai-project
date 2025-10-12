'use client'

import { useState, useMemo } from 'react'
import { Box, Typography, Grid, Button } from '@mui/material'
import ThumbCard from '../_components/ThumbCard'
import MenuCard from '../_components/MenuCard'
import ShoppedContainer from '../_components/ShoppedContainer'
import CategoryContainer from '../_components/CategoryContainer'
import { MenuItem, Category, rawMenuSchema, RawMenuCategory, RawMenuItem } from '../../zod'
import { useCart } from '../_components/CartContext'
import menuData from '../../menu.json'

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
      imageUrl: getCategoryImage(category.id),
      price: calculateAveragePrice(category.items)
    }))

    const menuItems: Record<string, MenuItem[]> = {}
    validatedMenu.menu.categories.forEach((category: RawMenuCategory) => {
      menuItems[category.id] = category.items.map((item: RawMenuItem) => ({
        id: item.id,
        name: item.ja_name,
        description: item.description,
        price: item.price,
        category: category.ja_name,
        isAvailable: true
      }))
    })

    console.log('Validated menu:', validatedMenu)
    console.log('Created categories:', categories)
    console.log('Created menuItems:', menuItems)

    return { categories, menuItems }
  }, [])

  // Helper function to get category image
  function getCategoryImage(categoryId: string): string {
    const imageMap: Record<string, string> = {
      'grilled-fried': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
      'salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      'others': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      'noodles': 'https://images.unsplash.com/photo-1552611052-33e04b0813e7?w=400&h=400&fit=crop',
      'stir-fried': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=400&fit=crop',
      'curries': 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=400&fit=crop',
      'rice-dishes': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
    }
    return imageMap[categoryId] || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop'
  }

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
        メニュー
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
