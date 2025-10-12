'use client'

import { 
  Typography, 
  Box,
  IconButton,
} from '@mui/material'
import { 
  ChevronLeft,
  Favorite,
  Search,
  Menu,
  MoreVert
} from '@mui/icons-material'
import { BackgroundContainer, MobileContainer } from '@ai-assistant/components'
import BottomBarTop from './BottomBarTop'

export default function HomePage() {
  return (
    <BackgroundContainer>
      <MobileContainer>
        <Box sx={{ 
          height: '100%', 
          maxHeight: '100%',
          bgcolor: 'rgb(113, 147, 193)', 
          position: 'relative', 
          overflow: 'hidden'
        }}>
          {/* Subtle cloud pattern background */}
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
            {/* Large soft clouds */}
            <Box sx={{ 
              position: 'absolute', 
              top: 60, 
              left: 50, 
              width: 120, 
              height: 80, 
              bgcolor: 'rgba(255, 255, 255, 0.6)', 
              borderRadius: '60px 40px 50px 30px',
              filter: 'blur(1px)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: 200, 
              left: 200, 
              width: 100, 
              height: 60, 
              bgcolor: 'rgba(255, 255, 255, 0.5)', 
              borderRadius: '50px 30px 40px 20px',
              filter: 'blur(1px)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: 350, 
              left: 80, 
              width: 90, 
              height: 70, 
              bgcolor: 'rgba(255, 255, 255, 0.4)', 
              borderRadius: '45px 35px 30px 25px',
              filter: 'blur(1px)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: 450, 
              left: 250, 
              width: 80, 
              height: 50, 
              bgcolor: 'rgba(255, 255, 255, 0.3)', 
              borderRadius: '40px 25px 35px 20px',
              filter: 'blur(1px)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: 120, 
              left: 300, 
              width: 70, 
              height: 45, 
              bgcolor: 'rgba(255, 255, 255, 0.4)', 
              borderRadius: '35px 20px 25px 15px',
              filter: 'blur(1px)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: 280, 
              left: 350, 
              width: 60, 
              height: 40, 
              bgcolor: 'rgba(255, 255, 255, 0.3)', 
              borderRadius: '30px 20px 25px 15px',
              filter: 'blur(1px)'
            }} />
          </Box>

          {/* Header Bar */}
          <Box sx={{ 
            bgcolor: 'transparent', 
            color: 'white', 
            px: 2, 
            py: 1, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10
          }}>
            {/* Left side - Back arrow and Heart */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ color: 'black', p: 0.5 }}>
                <ChevronLeft sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>

            {/* Center - Title */}
            <Typography variant="h6" textAlign="left" sx={{ 
              color: 'black', fontWeight: 'bold',
              textAlign: 'left',
              width: '100%'
            }}>
              AI 秘書Bot
            </Typography>

            {/* Right side - Action icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ color: 'black', p: 0.5 }}>
                <Search sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton sx={{ color: 'black', p: 0.5 }}>
                <Menu sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
          {/* Date Badge */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', // vertical align center
            mt: 2,
            position: 'absolute',
            top: 45,
            left: 0,
            right: 0,
            zIndex: 5
          }}>
            <Box sx={{ 
              bgcolor: 'rgba(128, 128, 128, 0.8)', 
              color: 'white', 
              px: 2, 
              py: 0.5, 
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 'medium',
              textAlign: 'center', // align text center
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '24px'
            }}>
              お問い合わせ、ご質問はこちらに表示されます
            </Box>
          </Box>
          <BottomBarTop onSendMessage={() => {}} />
        </Box>
      </MobileContainer>
    </BackgroundContainer>
  )
}
