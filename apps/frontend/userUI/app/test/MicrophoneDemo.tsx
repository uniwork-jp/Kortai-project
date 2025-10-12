"use client"

import { useState, useEffect } from 'react'
import { Box, Button, Typography, Alert } from '@mui/material'
import { Mic, MicOff } from '@mui/icons-material'
import useMicrophone from '../chat/useMicrophone'

interface MicrophoneDemoProps {
  onTranscript?: (transcript: string) => void
}

export default function MicrophoneDemo({ onTranscript }: MicrophoneDemoProps) {
  const [isIOS, setIsIOS] = useState(false)
  const [isChrome, setIsChrome] = useState(false)
  
  // Check browser type
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isChromeBrowser = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent)
    
    setIsIOS(isIOSDevice)
    setIsChrome(isChromeBrowser)
    
    console.log('Browser detection:', { isIOSDevice, isChromeBrowser })
  }, [])
  
  const {
    isRecording,
    isSupported,
    isEnabled,
    error,
    transcript,
    toggleRecording,
    clearTranscript
  } = useMicrophone({
    onTranscript: (finalTranscript) => {
      console.log('Final transcript:', finalTranscript)
      if (onTranscript) {
        onTranscript(finalTranscript)
      }
    },
    onError: (error) => {
      console.error('Microphone error:', error)
    },
    language: 'ja-JP'
  })

  const handleDebugPermission = async () => {
    console.log('=== Debug Permission Check ===')
    
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        console.log('Microphone permission state:', permission.state)
        alert(`マイク許可状態: ${permission.state}`)
      } catch (error) {
        console.error('Permission check failed:', error)
        alert('許可状態の確認に失敗しました')
      }
    } else {
      console.log('Permissions API not supported')
      alert('Permissions APIがサポートされていません')
    }
  }

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Microphone Test (useMicrophone)
      </Typography>
      
      {/* Support Status */}
      <Alert 
        severity={isSupported ? 'success' : 'error'} 
        sx={{ mb: 2 }}
      >
        {isSupported ? 'マイク機能がサポートされています' : 'マイク機能がサポートされていません'}
      </Alert>
      
      {/* iOS Instructions */}
      {isIOS && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>iPhone/iPad での使用方法:</strong><br/>
            1. マイクボタンをタップして許可を求められたら「許可」を選択<br/>
            2. 初回は必ずユーザーの操作（ボタンタップ）が必要です<br/>
            3. HTTPS接続が必要です（localhostは除く）
          </Typography>
        </Alert>
      )}
      
      {/* Chrome Instructions */}
      {isChrome && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Chrome での使用方法:</strong><br/>
            1. マイクボタンをクリックして許可を求められたら「許可」を選択<br/>
            2. 許可されない場合は、アドレスバー左側の🔒アイコンをクリック<br/>
            3. 「マイク」を「許可」に設定してページを再読み込み
          </Typography>
        </Alert>
      )}
      
      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Recording Button */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant={isRecording ? 'contained' : 'outlined'}
          color={isRecording ? 'error' : 'primary'}
          startIcon={isRecording ? <MicOff /> : <Mic />}
          onClick={toggleRecording}
          disabled={!isSupported}
          fullWidth
        >
          {isRecording ? '録音停止' : '録音開始'}
        </Button>
        
        {/* Debug button for Chrome */}
        {isChrome && (
          <Button
            variant="outlined"
            onClick={handleDebugPermission}
            size="small"
            color="secondary"
          >
            許可状態確認
          </Button>
        )}
      </Box>
      
      {/* Recording Status */}
      {isRecording && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="primary" gutterBottom>
            🎤 音声認識中... 話してください
          </Typography>
        </Box>
      )}
      
      {/* Transcript Display */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          認識結果:
        </Typography>
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: isRecording ? '#e3f2fd' : 'grey.100', 
            borderRadius: 1,
            minHeight: 60,
            border: '1px solid',
            borderColor: isRecording ? '#2196f3' : 'grey.300',
            transition: 'all 0.3s ease'
          }}
        >
          {transcript ? (
            <Typography 
              variant="body1" 
              sx={{ 
                color: isRecording ? '#1976d2' : 'text.primary',
                fontWeight: isRecording ? 500 : 400
              }}
            >
              {transcript}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {isRecording ? '音声を認識中...' : '認識結果がここに表示されます'}
            </Typography>
          )}
        </Box>
        
        {transcript && (
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              onClick={clearTranscript}
              variant="outlined"
            >
              クリア
            </Button>
            {onTranscript && (
              <Button 
                size="small" 
                onClick={() => onTranscript(transcript)}
                variant="contained"
                color="primary"
              >
                送信
              </Button>
            )}
          </Box>
        )}
      </Box>
      
      {/* Status Info */}
      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
        <Typography variant="caption" display="block">
          状態: {isRecording ? '音声認識中' : '待機中'}
        </Typography>
        <Typography variant="caption" display="block">
          マイク許可: {isEnabled ? '許可済み' : '未許可'}
        </Typography>
      </Box>
    </Box>
  )
}
