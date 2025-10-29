'use client'

import { 
  Typography, 
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material'
import { menuData } from '@kortai/jsons'

type MenuCategory = {
  id: string
  ja_name: string
  thai_name: string
  name: string
  items: Array<{
    id: string
    ja_name: string
    thai_name: string
    name: string
    description?: string
    price: number
  }>
}

export default function HomePage() {
  const { categories } = menuData.menu

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Order UI - Menu
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {categories.map((category: MenuCategory) => (
          <Card key={category.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                {category.ja_name} / {category.thai_name}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {category.items.map((item: MenuCategory['items'][0]) => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {item.ja_name}
                        </Typography>
                        {item.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                      <Chip 
                        label={`¥${item.price}`} 
                        color="primary" 
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

