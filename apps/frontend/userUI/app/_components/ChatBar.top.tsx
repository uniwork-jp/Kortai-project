'use client'

import { Box, IconButton, TextField } from '@mui/material'
import { Mic, Send } from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'

interface ChatBarProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export default function ChatBar({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "メッセージを入力" 
}: ChatBarProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [micPermissionError, setMicPermissionError] = useState(false)
  const [isMediaDevicesSupported, setIsMediaDevicesSupported] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Check MediaDevices API support on component mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsMediaDevicesSupported(false)
      setMicPermissionError(true)
      alert('このブラウザは音声録音機能をサポートしていません。\n\nHTTPS接続が必要な場合があります。\n\n対応ブラウザ：\n- Chrome 53+\n- Firefox 36+\n- Safari 11+\n- Edge 12+')
    }
  }, [])

  const showPermissionInstructions = () => {
    const instructions = `
マイクのアクセスが拒否されました。

以下の手順で設定を変更してください：

1. ブラウザのアドレスバー左側の🔒アイコンをクリック
2. 「マイク」の設定を「許可」に変更
3. ページを再読み込みしてください

または、ブラウザの設定から：
- Chrome: 設定 > プライバシーとセキュリティ > サイトの設定 > マイク
- Firefox: 設定 > プライバシーとセキュリティ > 権限 > マイク
- Edge: 設定 > サイトの権限 > マイク
    `
    alert(instructions)
  }

  const startRecording = async () => {
    // Early return if MediaDevices API is not supported
    if (!isMediaDevicesSupported) {
      return
    }

    try {
      // Check if MediaDevices API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll just show a placeholder message
        setMessage('音声が録音されました (Audio recorded)')
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setMicPermissionError(false) // Reset error state on successful start
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setMicPermissionError(true)
      setIsRecording(false)
      
      if (error instanceof Error && error.message === 'MediaDevices API not supported') {
        alert('このブラウザは音声録音機能をサポートしていません。\n\nHTTPS接続が必要な場合があります。\n\n対応ブラウザ：\n- Chrome 53+\n- Firefox 36+\n- Safari 11+\n- Edge 12+')
      } else if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            showPermissionInstructions()
            break
          case 'NotFoundError':
            alert('マイクが見つかりません。マイクが接続されているか確認してください。')
            break
          case 'NotReadableError':
            alert('マイクが他のアプリケーションで使用中です。他のアプリを閉じてから再試行してください。')
            break
          case 'OverconstrainedError':
            alert('マイクの設定に問題があります。ブラウザの設定を確認してください。')
            break
          default:
            alert('マイクへのアクセス中にエラーが発生しました。ブラウザの設定を確認してください。')
        }
      } else {
        alert('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。')
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

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
      right: 0,
      zIndex: 10
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Text input field */}
        <TextField
          fullWidth
          placeholder={isLoading ? "送信中..." : placeholder}
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
          disabled={!isMediaDevicesSupported}
          sx={{ 
            color: !isMediaDevicesSupported ? 'grey' : micPermissionError ? 'orange' : isRecording ? 'red' : 'rgba(0, 0, 0, 0.6)',
            bgcolor: !isMediaDevicesSupported ? 'rgba(128, 128, 128, 0.1)' : micPermissionError ? 'rgba(255, 165, 0, 0.1)' : isRecording ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
            border: !isMediaDevicesSupported ? 'none' : micPermissionError ? '2px solid orange' : 'none'
          }}
          onClick={handleMicClick}
          title={!isMediaDevicesSupported ? 'このブラウザは音声録音をサポートしていません' : micPermissionError ? 'マイクのアクセスが拒否されています。設定を確認してください。' : isRecording ? '録音を停止' : '録音を開始'}
        >
          <Mic sx={{ fontSize: 24 }} />
        </IconButton>

        {/* Send button */}
        <IconButton 
          disabled={!message.trim() || isLoading}
          onClick={handleSendMessage}
          sx={{ 
            color: (!message.trim() || isLoading) ? 'grey' : 'primary.main',
            bgcolor: (!message.trim() || isLoading) ? 'rgba(128, 128, 128, 0.1)' : 'rgba(25, 118, 210, 0.1)',
            '&:hover': {
              bgcolor: (!message.trim() || isLoading) ? 'rgba(128, 128, 128, 0.1)' : 'rgba(25, 118, 210, 0.2)',
            }
          }}
          title="メッセージを送信"
        >
          <Send sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
