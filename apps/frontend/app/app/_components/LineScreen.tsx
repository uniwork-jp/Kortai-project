"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Talk from './ChatText.user'
import BottomBar from './BottomBar'
import ChatContainer from './ChatContainer'
import HeaderBar from './HeaderBar'
import DateBadge from './DateBadge'
import CloudBackground from './CloudBackground'

interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}

export default function LineScreenUI() {
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
    <ChatContainer>
      <CloudBackground />
      
      <HeaderBar 
        onBackClick={handleBackToHome}
        title="AI 秘書Bot"
      />

      <DateBadge date="SUN, 10/28" />

      <Talk messages={messages} isLoading={isLoading} />

      <BottomBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </ChatContainer>
  )
}
