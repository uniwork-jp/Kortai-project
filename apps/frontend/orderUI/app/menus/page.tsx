'use client'

import { 
  Typography, 
  Box,
} from '@mui/material'
import { menuData } from '@kortai/jsons'
import BottomBar from './BottomBar'
import { OrderProvider } from '../_components/OrderContext'
import MenuCard from './MenuCard'

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

export default function MenusPage() {
  const { categories } = menuData.menu

  return (
    <OrderProvider>
      <Box sx={{ 
        p: 3,
        maxWidth: '1400px',
        margin: '0 auto',
        paddingBottom: 10 // Add padding for bottom bar
      }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Order UI - Menu
        </Typography>
        
        {categories.map((category) => {
          const items: MenuItem[] = category.items.map((item) => ({
            ...item,
            category: {
              id: category.id,
              ja_name: category.ja_name,
              thai_name: category.thai_name,
              name: category.name,
            },
          }))

          return (
            <Box key={category.id} sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  borderBottom: 2,
                  borderColor: 'primary.main',
                  pb: 1
                }}
              >
                {category.ja_name} ({category.thai_name})
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)'
                },
                gap: 2
              }}>
                {items.map((item: MenuItem) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </Box>
            </Box>
          )
        })}
        
        <BottomBar />
      </Box>
    </OrderProvider>
  )
}

