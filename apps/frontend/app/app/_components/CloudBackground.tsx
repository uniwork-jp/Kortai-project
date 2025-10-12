"use client"

import { Box } from '@mui/material'

interface CloudBackgroundProps {
  opacity?: number
}

export default function CloudBackground({ opacity = 0.15 }: CloudBackgroundProps) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, opacity }}>
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
  )
}
