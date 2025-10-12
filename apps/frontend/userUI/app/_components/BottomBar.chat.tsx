'use client'

import { Box, IconButton, TextField } from '@mui/material'
import { Mic } from '@mui/icons-material'
import { useState } from 'react'

interface BottomBarProps {
  onSendMessage: (message: string) => void
  onMicClick?: () => void
  isLoading?: boolean
  isRecording?: boolean
  micDisabled?: boolean
  micError?: boolean
}

export default function BottomBar({ 
  onSendMessage, 
  onMicClick,
  isLoading = false,
  isRecording = false,
  micDisabled = false,
  micError = false
}: BottomBarProps) {
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('') // Clear the text field
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleMicClick = () => {
    if (onMicClick) {
      onMicClick()
    }
  }
  return (
    <Box sx={{ 
      bgcolor: 'white', 
      borderTop: '1px solid', 
      borderColor: 'grey.200', 
      px: 2, 
      py: 1.5,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Text input field */}
        <TextField
          fullWidth
          placeholder={isLoading ? "送信中..." : "メッセージを入力"}
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: isLoading ? '#e0e0e0' : '#f5f5f5',
              '& fieldset': { border: 'none' },
              '& input': { 
                fontSize: '14px',
                py: 1
              },
            },
          }}
        />

        {/* Mic button */}
        <IconButton 
          disabled={micDisabled}
          sx={{ 
            color: micDisabled ? 'grey' : micError ? 'orange' : isRecording ? 'red' : 'rgba(0, 0, 0, 0.6)',
            bgcolor: micDisabled ? 'rgba(128, 128, 128, 0.1)' : micError ? 'rgba(255, 165, 0, 0.1)' : isRecording ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
            border: micDisabled ? 'none' : micError ? '2px solid orange' : 'none'
          }}
          onClick={handleMicClick}
          title={micDisabled ? 'マイク機能は無効です' : micError ? 'マイクエラーが発生しています' : isRecording ? '録音を停止' : '録音を開始'}
        >
          <Mic sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
