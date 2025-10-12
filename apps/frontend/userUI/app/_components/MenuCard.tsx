import React from 'react'
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip,
  Box,
  IconButton,
  Badge
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { MenuItem } from '../../zod'

interface MenuCardProps {
  item: MenuItem
  quantity?: number
  onAdd?: (item: MenuItem) => void
  onRemove?: (item: MenuItem) => void
  onQuantityChange?: (item: MenuItem, quantity: number) => void
}

export default function MenuCard({ 
  item, 
  quantity = 0,
  onAdd,
  onRemove,
  onQuantityChange
}: MenuCardProps) {
  const handleAdd = () => {
    if (onAdd) {
      onAdd(item)
    } else if (onQuantityChange) {
      onQuantityChange(item, quantity + 1)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item)
    } else if (onQuantityChange && quantity > 0) {
      onQuantityChange(item, quantity - 1)
    }
  }

  return (
    <Card 
      sx={{ 
        maxWidth: 300,
        opacity: item.isAvailable ? 1 : 0.6,
        position: 'relative'
      }}
    >
      {item.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={item.imageUrl}
          alt={item.name}
        />
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {item.name}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            ¥{item.price.toLocaleString()}
          </Typography>
        </Box>

        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip 
            label={item.category} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          {item.tags?.map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              variant="outlined"
            />
          ))}
        </Box>

        {item.allergens && item.allergens.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>
              アレルギー: {item.allergens.join(', ')}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={handleRemove}
              disabled={quantity === 0}
              size="small"
              color="error"
            >
              <RemoveIcon />
            </IconButton>
            
            <Badge 
              badgeContent={quantity} 
              color="primary"
              invisible={quantity === 0}
            >
              <Typography variant="body1" sx={{ minWidth: '20px', textAlign: 'center' }}>
                {quantity}
              </Typography>
            </Badge>
            
            <IconButton 
              onClick={handleAdd}
              disabled={!item.isAvailable}
              size="small"
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {!item.isAvailable && (
            <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
              売り切れ
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
