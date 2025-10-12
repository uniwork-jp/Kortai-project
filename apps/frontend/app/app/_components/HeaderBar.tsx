"use client"

import { 
  Box, 
  IconButton, 
  Typography,
} from '@mui/material'
import { 
  ArrowBack,
} from '@mui/icons-material'

interface HeaderBarProps {
  onBackClick?: () => void
  title?: string
}

export default function HeaderBar({ 
  onBackClick, 
  title = "AI 秘書Bot" 
}: HeaderBarProps) {
  return (
    <Box sx={{ 
      bgcolor: 'rgba(0, 0, 0, 0.8)', 
      color: 'white', 
      px: 2, 
      py: 1, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <IconButton sx={{ color: 'white', p: 0.5 }} onClick={onBackClick}>
          <ArrowBack sx={{ fontSize: 24 }} />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ width: 40 }} /> {/* Spacer to balance the back button */}
      </Box>
    </Box>
  )
}
