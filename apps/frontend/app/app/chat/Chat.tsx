"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatTextUser from '../_components/ChatText.user'
import ChatTextResponse from '../_components/ChatText.response'
import BottomBar from '../_components/BottomBar'
import ChatContainer from '../_components/ChatContainer'
import TalkContainer from '../_components/TalkContainer'
import HeaderBar from '../_components/HeaderBar'
import DateBadge from '../_components/DateBadge'
import CloudBackground from '../_components/CloudBackground'
import useMessageHandler from './useMessageHandler'
import useMicrophone from './useMicrophone'
import { Box } from '@mui/material'

interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}

// Messages component that accepts messages as props
function Messages({ messages }: { messages: Message[] }) {
  return (
    <Box>
      {messages.map((message) => (
        <Box key={message.id}>
          {message.isUser ? (
            <ChatTextUser messages={[message]} isLoading={false} />
          ) : (
            <ChatTextResponse messages={[message]} isLoading={false} />
          )}
        </Box>
      ))}
    </Box>
  )
}

interface ChatProps {
  title?: string
  date?: string
  backgroundColor?: string
  cloudOpacity?: number
  onBackClick?: () => void
}

export default function Chat({
  title = "AI 秘書Bot",
  date = "SUN, 10/28",
  backgroundColor = 'rgb(113, 147, 193)',
  cloudOpacity = 0.15,
  onBackClick
}: ChatProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const { handleSendMessage } = useMessageHandler({
    onMessagesUpdate: (newMessages: Message[]) => {
      // Update the main messages array
      setMessages(newMessages)
    },
    onLoadingChange: setIsLoading,
    currentMessages: messages
  })

  const {
    isRecording,
    isSupported,
    isEnabled,
    error: micError,
    transcript,
    accumulatedText,
    toggleRecording,
    clearTranscript,
    clearAllText
  } = useMicrophone({
    onError: (error: string) => {
      console.error('Microphone error:', error)
    },
    language: 'ja-JP'
  })

  // Debug logging
  console.log('Microphone state:', { isRecording, isSupported, isEnabled, micError })

  const handleSendTranscript = () => {
    const textToSend = accumulatedText || transcript
    if (textToSend.trim()) {
      handleSendMessage(textToSend.trim())
      clearAllText()
    }
  }

  const handleBackToHome = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      router.push('/')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    console.log('Chat handleKeyDown called with key:', event.key) // Debug log
    // Additional keyboard handling can be added here if needed
    // The main Enter key handling is already implemented in BottomBar
  }


  return (
    <ChatContainer backgroundColor={backgroundColor}>
      <CloudBackground opacity={cloudOpacity} />
      <HeaderBar 
          onBackClick={handleBackToHome}
          title={title}
        />
      <TalkContainer>
        {/* <Box /> */}

        <DateBadge date={date} />
        <Messages messages={messages} />
      </TalkContainer>
        <BottomBar 
          onSendMessage={handleSendMessage} 
          onKeyDown={handleKeyDown}
          onMicClick={toggleRecording}
          onSendTranscript={handleSendTranscript}
          onClearTranscript={clearAllText}
          isLoading={isLoading}
          isRecording={isRecording}
          micDisabled={!isSupported}
          micError={!!micError}
          transcript={accumulatedText || transcript}
        />
    </ChatContainer>
  )
}
