"use client"

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseMicrophoneProps {
  onTranscript?: (transcript: string) => void
  onError?: (error: string) => void
  onAudioData?: (audioBlob: Blob) => void
  language?: string
}

interface UseMicrophoneReturn {
  isRecording: boolean
  isSupported: boolean
  isEnabled: boolean
  error: string | null
  transcript: string
  accumulatedText: string
  audioLevel: number
  startRecording: () => void
  stopRecording: () => void
  toggleRecording: () => void
  clearTranscript: () => void
  clearAllText: () => void
}

export function useMicrophone({
  onTranscript,
  onError,
  onAudioData,
  language = 'ja-JP'
}: UseMicrophoneProps = {}): UseMicrophoneReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [accumulatedText, setAccumulatedText] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Function to handle silence timeout
  const resetSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
    }
    
    if (isRecording) {
      silenceTimeoutRef.current = setTimeout(() => {
        console.log('Auto-stopping recording due to silence')
        if (recognitionRef.current) {
          recognitionRef.current.stop()
        }
        setIsRecording(false)
        setAudioLevel(0)
      }, 3000) // 3 seconds of silence
    }
  }, [isRecording])

  // iOS-specific auto-stop mechanism
  const startIOSAutoStop = useCallback(() => {
    // On iOS, also use a backup timer that doesn't depend on onresult events
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS && isRecording) {
      setTimeout(() => {
        if (isRecording && recognitionRef.current) {
          console.log('iOS: Auto-stopping recording after 5 seconds')
          recognitionRef.current.stop()
          setIsRecording(false)
          setAudioLevel(0)
        }
      }, 5000) // 5 seconds backup timer for iOS
    }
  }, [isRecording])

  // Enhanced silence detection for iOS
  const resetSilenceTimeoutIOS = useCallback(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      // On iOS, use a shorter timeout and more aggressive reset
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
      
      if (isRecording) {
        silenceTimeoutRef.current = setTimeout(() => {
          console.log('iOS: Auto-stopping recording due to silence')
          if (recognitionRef.current) {
            recognitionRef.current.stop()
          }
          setIsRecording(false)
          setAudioLevel(0)
        }, 2000) // Shorter timeout for iOS (2 seconds)
      }
    }
  }, [isRecording])

  // Check for browser support
  useEffect(() => {
    const checkSupport = () => {
      const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      const hasMediaRecorder = !!window.MediaRecorder
      const hasAudioContext = !!(window.AudioContext || (window as any).webkitAudioContext)
      
      // Check if we're on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost'
      
      console.log('Browser support check:', {
        getUserMedia: hasGetUserMedia,
        MediaRecorder: hasMediaRecorder,
        AudioContext: hasAudioContext,
        isIOS,
        isSafari,
        isHTTPS
      })
      
      setIsSupported(hasGetUserMedia && hasMediaRecorder && hasAudioContext)
      
      if (!hasGetUserMedia) {
        setError('このブラウザはマイクアクセスをサポートしていません')
      } else if (!hasMediaRecorder) {
        setError('このブラウザは音声録音をサポートしていません')
      } else if (!hasAudioContext) {
        setError('このブラウザは音声分析をサポートしていません')
      } else if (isIOS && !isHTTPS) {
        setError('iOSではHTTPS接続が必要です')
      } else if (isIOS && isSafari) {
        console.log('iOS Safari detected - microphone access requires user interaction')
      }
    }

    checkSupport()
    
    return () => {
      cleanup()
    }
  }, [])

  const cleanup = useCallback(() => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    // Stop audio level monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    
    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
    }
    
    // Clear silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
    }
    
    setIsRecording(false)
    setAudioLevel(0)
  }, [])

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'NotAllowedError':
        return 'マイクの使用が許可されていません。ブラウザの設定でマイクアクセスを許可してください。'
      case 'NotFoundError':
        return 'マイクが見つかりません'
      case 'NotReadableError':
        return 'マイクが他のアプリケーションで使用されています'
      case 'OverconstrainedError':
        return 'マイクの設定に問題があります'
      case 'SecurityError':
        return 'セキュリティエラーが発生しました。HTTPS接続が必要です。'
      case 'AbortError':
        return 'マイクアクセスが中断されました'
      case 'NotSupportedError':
        return 'このブラウザはマイク機能をサポートしていません'
      case 'InvalidStateError':
        return 'マイクが無効な状態です。ページを再読み込みしてください。'
      default:
        return `マイクエラー: ${error}`
    }
  }

  const stopRecording = useCallback(() => {
    console.log('useMicrophone: Stopping recording...')
    
    // Clear silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    setIsRecording(false)
    setAudioLevel(0)
  }, [])

  const startRecording = useCallback(async () => {
    console.log('useMicrophone: Starting recording...')
    
    if (!isSupported) {
      const errorMsg = 'マイク機能がサポートされていません'
      setError(errorMsg)
      if (onError) {
        onError(errorMsg)
      }
      return
    }

    try {
      setError(null)
      setTranscript('')
      
      // Use Web Speech API directly (like useMicrophone)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        const errorMsg = '音声認識機能がサポートされていません'
        setError(errorMsg)
        if (onError) {
          onError(errorMsg)
        }
        return
      }
      
      const recognition = new SpeechRecognition()
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      
      // iOS-specific configuration
      if (isIOS) {
        recognition.continuous = false  // iOS works better with continuous=false
        recognition.interimResults = true
        recognition.maxAlternatives = 1
      } else {
        recognition.continuous = true  // Keep recording until manually stopped
        recognition.interimResults = true
      }
      
      recognition.lang = language
      
      // Store recognition instance for stopping
      recognitionRef.current = recognition
      
      recognition.onstart = () => {
        console.log('Speech recognition started')
        setIsRecording(true)
        setError(null)
        // Start silence timeout (iOS-specific or regular)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        if (isIOS) {
          resetSilenceTimeoutIOS()
        } else {
          resetSilenceTimeout()
        }
        // Start iOS-specific auto-stop
        startIOSAutoStop()
      }
      
      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Reset silence timeout when speech is detected
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        if (isIOS) {
          resetSilenceTimeoutIOS()
        } else {
          resetSilenceTimeout()
        }

        // Accumulate all final text permanently
        if (finalTranscript) {
          setAccumulatedText(prev => prev + finalTranscript)
        }

        // Show current session transcript (interim + final)
        const currentTranscript = finalTranscript + interimTranscript
        setTranscript(currentTranscript)

        // Don't auto-send messages - keep text in transcript for manual action
        // User will manually send or clear the text
      }
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        const errorMessage = getErrorMessage(event.error)
        setError(errorMessage)
        setIsRecording(false)
        
        if (onError) {
          onError(errorMessage)
        }
      }
      
      recognition.onend = () => {
        console.log('Speech recognition ended')
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        
        if (isIOS && isRecording) {
          // On iOS with continuous=false, restart recognition after a short delay
          console.log('iOS: Restarting speech recognition')
          setTimeout(() => {
            if (isRecording && recognitionRef.current) {
              try {
                recognitionRef.current.start()
              } catch (error) {
                console.log('iOS: Failed to restart recognition:', error)
                setIsRecording(false)
                setAudioLevel(0)
              }
            }
          }, 100)
        } else {
          setIsRecording(false)
          setAudioLevel(0)
        }
      }
      
      // Start recognition
      recognition.start()
      
    } catch (error: any) {
      console.error('Failed to start recording:', error)
      const errorMsg = getErrorMessage(error.name)
      setError(errorMsg)
      setIsRecording(false)
      
      if (onError) {
        onError(errorMsg)
      }
    }
  }, [isSupported, onError, onTranscript, language])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  const clearAllText = useCallback(() => {
    setTranscript('')
    setAccumulatedText('')
  }, [])

  return {
    isRecording,
    isSupported,
    isEnabled,
    error,
    transcript,
    accumulatedText,
    audioLevel,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
    clearAllText
  }
}

export default useMicrophone
