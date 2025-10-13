import React from 'react'
import { 
  Box, 
  Typography, 
  Grid,
  Paper,
  Divider
} from '@mui/material'
import ThumbCard from './ThumbCard'
import { MenuItem, Category } from '../../schemas'
import { useCart } from './CartContext'

interface CategoryContainerProps {
  menuItems: Record<string, MenuItem[]>
  category: Category
}

export default function CategoryContainer({ menuItems, category }: CategoryContainerProps) {
  const { getItemCount } = useCart()

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
        <Box gap={1} display="flex" flexDirection="column" sx={{ mb: 4 }}>
          {/* Category Header */}
          <Typography variant="h5" sx={{ fontWeight: 'normal', textAlign: 'left' }}>
            {category.ja_name} &nbsp; <span style={{ fontSize: '0.7em', fontWeight: 'normal' }}>{category.thai_name}</span>
          </Typography>

          {/* Menu Items */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, justifyContent: 'center', mt: 1, mb: 1, pb: 1 }}>
            {items.map((item) => (
                <ThumbCard
                  key={item.id}
                  title={item.name}
                  imageUrl={item.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop'}
                  menuId={item.id}
                  price={item.price}
                  cartCount={getItemCount(item.id)}
                />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
