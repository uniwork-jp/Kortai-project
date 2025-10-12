'use client'

import { Box, IconButton, TextField, Button } from '@mui/material'
import { Mic, Send, Clear } from '@mui/icons-material'
import { useState } from 'react'

interface BottomBarUIProps {
  onSendMessage: (message: string) => void
  onMicClick?: () => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onSendTranscript?: () => void
  onClearTranscript?: () => void
  isLoading?: boolean
  isRecording?: boolean
  micDisabled?: boolean
  micError?: boolean
  transcript?: string
}

export default function BottomBar({ 
  onSendMessage, 
  onMicClick,
  onKeyDown,
  onSendTranscript,
  onClearTranscript,
  isLoading = false,
  isRecording = false,
  micDisabled = false,
  micError = false,
  transcript = ''
}: BottomBarUIProps) {
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('') // Clear the text field
    }
  }


  const handleMicClick = () => {
    if (onMicClick) {
      onMicClick()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
    // Call external onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(event)
    }
  }

  return (
    <Box sx={{ 
      bgcolor: 'white', 
      borderTop: '1px solid', 
      borderColor: 'grey.200',
      boxSizing: 'border-box',
      width: '100%',
      px: 2, 
      py: 1.5,
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0
    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          maxWidth: '100dvw',
          minWidth: 0,
          margin: '0 auto',
          overflowX: 'hidden',
        }}
      >
        {/* Text input field */}
        <TextField
          fullWidth
          placeholder={isLoading ? "送信中..." : transcript ? "音声認識結果" : "メッセージを入力"}
          variant="outlined"
          size="small"
          value={transcript || message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || !!transcript}
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: isLoading ? '#e0e0e0' : transcript ? '#e3f2fd' : '#f5f5f5',
              borderColor: transcript ? '#2196f3' : 'transparent',
              '& fieldset': { 
                border: transcript ? '2px solid #2196f3' : 'none' 
              },
              '& input': { 
                fontSize: '16px',
                py: 1,
                color: transcript ? '#1976d2' : 'inherit'
              },
            },
          }}
        />

        {/* Mic button */}
        <IconButton 
          disabled={micDisabled}
          sx={{ 
            flexShrink: 0,
            color: micDisabled ? 'grey' : micError ? 'orange' : isRecording ? 'red' : 'rgba(0, 0, 0, 0.6)',
            bgcolor: micDisabled ? 'rgba(128, 128, 128, 0.1)' : micError ? 'rgba(255, 165, 0, 0.1)' : isRecording ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
            border: micDisabled ? 'none' : micError ? '2px solid orange' : 'none'
          }}
          onClick={handleMicClick}
          title={micDisabled ? 'マイク機能は無効です' : micError ? 'マイクエラーが発生しています' : isRecording ? '録音を停止' : '録音を開始'}
        >
          <Mic sx={{ fontSize: 24 }} />
        </IconButton>

        {/* Manual control buttons when transcript is available */}
        {transcript && !isRecording && (
          <>
            <Button
              variant="contained"
              size="small"
              startIcon={<Send />}
              onClick={onSendTranscript}
              sx={{
                flexShrink: 0,
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                fontSize: '12px',
                minWidth: 'auto'
              }}
            >
              送信
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Clear />}
              onClick={onClearTranscript}
              sx={{
                flexShrink: 0,
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                fontSize: '12px',
                minWidth: 'auto'
              }}
            >
              クリア
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}
