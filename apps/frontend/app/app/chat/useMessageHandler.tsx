"use client"

import { useState } from 'react'

interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}

interface MessageHandlerProps {
  onMessagesUpdate: (messages: Message[]) => void
  onLoadingChange: (isLoading: boolean) => void
  currentMessages?: Message[]
}

export function useMessageHandler({ onMessagesUpdate, onLoadingChange, currentMessages = [] }: MessageHandlerProps) {
  const handleSendMessage = async (text: string) => {
    // console.log('handleSendMessage called with text:', text)
    if (text.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        timestamp: new Date(),
        isUser: true
      }
      // console.log('newMessage', newMessage)
      // Add user message immediately to UI
      const updatedMessages = [...currentMessages, newMessage]
      onMessagesUpdate(updatedMessages)
      onLoadingChange(true)

      try {
        // Send message to backend
        const response = await fetch('/api/test-chat', {
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
        // console.log('data', data)
        
        // Add AI response to messages
        if (data.success && data.aiResponse) {
          const responseText = data.originalMessage
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            text: `${responseText} を実行しました`,
            timestamp: new Date(),
            isUser: false
          }
          const finalMessages = [...updatedMessages, aiMessage]
          onMessagesUpdate(finalMessages)
        }
      } catch (error) {
        console.error('Error sending message:', error)
        // Add error message to the chat
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          text: '申し訳ございません。メッセージの送信に失敗しました。',
          timestamp: new Date(),
          isUser: false
        }
        const errorMessages = [...updatedMessages, errorMessage]
        onMessagesUpdate(errorMessages)
      } finally {
        onLoadingChange(false)
      }
    }
  }

  return { handleSendMessage }
}

export default useMessageHandler
