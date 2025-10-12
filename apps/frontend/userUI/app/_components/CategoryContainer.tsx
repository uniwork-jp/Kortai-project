import React from 'react'
import { 
  Box, 
  Typography, 
  Grid,
  Paper,
  Divider
} from '@mui/material'
import MenuCard from './MenuCard'
import { MenuItem, Category } from '../../zod'
import { useCart } from './CartContext'

interface CategoryContainerProps {
  menuItems: Record<string, MenuItem[]>
  category: Category
}

export default function CategoryContainer({ menuItems, category }: CategoryContainerProps) {
  const { getItemCount, updateQuantity } = useCart()

  const handleQuantityChange = (item: MenuItem, quantity: number) => {
    updateQuantity(item.id, quantity)
  }

  if (!category) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
          カテゴリが見つかりません
        </Typography>
      </Box>
    )
  }

  const items = menuItems[category.id] || []

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        メニュー一覧
      </Typography>
      
      {items.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            メニューがありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            メニューアイテムを追加してください
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ mb: 4 }}>
          {/* Category Header */}
          <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: 'primary.main', color: 'white' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {category.title}
            </Typography>
          </Paper>

          {/* Menu Items Grid */}
          <Grid container spacing={3} justifyContent="center">
            {items.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                <MenuCard
                  item={item}
                  quantity={getItemCount(item.id)}
                  onQuantityChange={handleQuantityChange}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  )
}
