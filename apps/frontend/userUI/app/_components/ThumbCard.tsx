import React from 'react'
import { 
  Card, 
  CardMedia, 
  Box,
  Typography,
  Badge
} from '@mui/material'
import { MenuItem } from '../../zod'

interface ThumbCardProps {
  title: string
  imageUrl: string
  menuId: MenuItem['id']
  price: MenuItem['price']
  cartCount?: number
  onClick?: () => void
}

export default function ThumbCard({ 
  title, 
  imageUrl, 
  menuId,
  price,
  cartCount = 0,
  onClick 
}: ThumbCardProps) {
  return (
    <Card 
      sx={{ 
        width: '100%',
        aspectRatio: '1',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
          boxShadow: 6
        } : {}
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="100%"
        image={imageUrl}
        alt={title}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }}
      />
      
      {/* Price overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: 1
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          ¥{price.toLocaleString()}
        </Typography>
      </Box>

      {/* Cart count badge */}
      {cartCount > 0 && (
        <Badge
          badgeContent={cartCount}
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            '& .MuiBadge-badge': {
              fontSize: '0.8rem',
              fontWeight: 'bold',
              minWidth: '20px',
              height: '20px'
            }
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                fontSize: '0.7rem'
              }}
            >
              カート
            </Typography>
          </Box>
        </Badge>
      )}
    </Card>
  )
}
