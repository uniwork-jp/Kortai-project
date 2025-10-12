import { Box, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'

interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}

interface TalkProps {
  messages: Message[]
  isLoading?: boolean
}

export default function Talk({ messages, isLoading = false }: TalkProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  return (
    <Box sx={{ 
      zIndex: 1
    }}>
      {/* Render messages */}
      {messages.map((message) => (
        <Box key={message.id} sx={{ 
          display: 'flex', 
          justifyContent: message.isUser ? 'flex-end' : 'flex-start', 
          mb: 2 
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: message.isUser ? 'flex-end' : 'flex-start' 
          }}>
            <Box sx={{ 
              bgcolor: message.isUser ? '#4CAF50' : '#ffffff', 
              color: message.isUser ? 'white' : 'black', 
              px: 2, 
              py: 1, 
              borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              maxWidth: 250,
              fontSize: '14px',
              boxShadow: message.isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {message.text}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {message.isUser && (
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
                  既読
                </Typography>
              )}
              <Typography variant="caption" sx={{ 
                color: message.isUser ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)', 
                fontSize: '11px' 
              }}>
                {formatTime(message.timestamp)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          mb: 2 
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start' 
          }}>
            <Box sx={{ 
              bgcolor: '#ffffff', 
              color: 'black', 
              px: 2, 
              py: 1, 
              borderRadius: '18px 18px 18px 4px',
              maxWidth: 250,
              fontSize: '14px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5,
                '& > div': {
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  animation: 'pulse 1.4s ease-in-out infinite both',
                  '&:nth-of-type(1)': { animationDelay: '-0.32s' },
                  '&:nth-of-type(2)': { animationDelay: '-0.16s' },
                  '@keyframes pulse': {
                    '0%, 80%, 100%': { transform: 'scale(0)' },
                    '40%': { transform: 'scale(1)' }
                  }
                }
              }}>
                <div></div>
                <div></div>
                <div></div>
              </Box>
              考え中...
            </Box>
          </Box>
        </Box>
      )}
      
      <div ref={messagesEndRef} />
    </Box>
  )
}