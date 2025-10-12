"use client"

import { 
  Box, 
  IconButton, 
  Typography,
} from '@mui/material'
import { 
  ArrowBack,
} from '@mui/icons-material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Talk from './ChatText.user'
import BottomBar from './BottomBar.chat'
import BottomBarUI from './BottomBar'

interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}

export default function LineScreen() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        timestamp: new Date(),
        isUser: true
      }
      
      // Add user message immediately to UI
      setMessages(prev => [...prev, newMessage])
      setIsLoading(true)

      try {
        // Send message to backend
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user-1', // You might want to get this from auth context
            message: text.trim(),
            category: 'general'
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const data = await response.json()
        
        // Add AI response to messages
        if (data.success && data.data) {
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            text: data.data.response,
            timestamp: new Date(),
            isUser: false
          }
          setMessages(prev => [...prev, aiMessage])
        }
      } catch (error) {
        console.error('Error sending message:', error)
        // You could add an error message to the chat here
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          text: '申し訳ございません。メッセージの送信に失敗しました。',
          timestamp: new Date(),
          isUser: false
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }
  return (
    <Box sx={{ 
      height: '100vh', 
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
        bgcolor: 'rgba(0, 0, 0, 0.8)', 
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <IconButton sx={{ color: 'white', p: 0.5 }} onClick={handleBackToHome}>
            <ArrowBack sx={{ fontSize: 24 }} />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              AI 秘書Bot
            </Typography>
          </Box>
          <Box sx={{ width: 40 }} /> {/* Spacer to balance the back button */}
        </Box>
      </Box>

      {/* Date Badge */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
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
          fontWeight: 'medium'
        }}>
          SUN, 10/28
        </Box>
      </Box>

      {/* Talk Area */}
      <Talk messages={messages} isLoading={isLoading} />

      {/* Bottom Input Area */}
      <BottomBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </Box>
  )
}
