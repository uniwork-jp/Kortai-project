'use client'

import { Box, Typography, Button } from '@mui/material'
import { PlayArrow, ContactSupport } from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BottomBarProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export default function BottomBar({ onSendMessage, isLoading = false }: BottomBarProps) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [micPermissionError, setMicPermissionError] = useState(false)
  const [isMediaDevicesSupported, setIsMediaDevicesSupported] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const handleTaskExecution = () => {
    router.push('/chat')
  }

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
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }}>
      {/* Yellow-orange action buttons section */}
      <Box sx={{ 
        bgcolor: '#FFB74D', 
        px: 2, 
        py: 2,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        {/* Task Execution Button */}
        <Button
          onClick={handleTaskExecution}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            color: '#8D4E00',
            bgcolor: 'white',
            borderRadius: '12px',
            px: 2,
            py: 1.5,
            minWidth: '80px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: '#f5f5f5',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }
          }}
        >
          <PlayArrow sx={{ fontSize: 24, color: '#8D4E00' }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#8D4E00' }}>
            タスクを実行
          </Typography>
        </Button>
        {/* Contact Button */}
        <Button
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            color: '#8D4E00',
            bgcolor: 'white',
            borderRadius: '12px',
            px: 2,
            py: 1.5,
            minWidth: '80px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: '#f5f5f5',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }
          }}
        >
          <ContactSupport sx={{ fontSize: 24, color: '#8D4E00' }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#8D4E00' }}>
            お問い合わせ
          </Typography>
        </Button>
      </Box>
    </Box>
  )
}
