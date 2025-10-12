'use client'

import BottomBar from '../_components/BottomBar'
import ChatContainer from '../_components/ChatContainer'
import HeaderBar from '../_components/HeaderBar'
import Chat from '../chat/Chat'
import Talk from '../_components/ChatText.user'
import { BackgroundContainer, MobileContainer } from '@ai-assistant/components'
import DateBadge from '../_components/DateBadge'
import MicrophoneDemo from './MicrophoneDemo'

// Mock messages for testing
const mockMessages = [
  {
    id: '1',
    text: 'こんにちは！今日の天気はどうですか？',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    isUser: true
  },
  {
    id: '2',
    text: 'こんにちは！申し訳ございませんが、リアルタイムの天気情報にアクセスできません。天気予報をご確認いただくか、天気アプリをご利用ください。他に何かお手伝いできることはありますか？',
    timestamp: new Date(Date.now() - 280000), // 4 minutes 40 seconds ago
    isUser: false
  },

]

export default function TestPage() {
  const handleTranscript = (transcript: string) => {
    console.log('Transcript received:', transcript)
    // You can add logic here to handle the transcript
  }

  return (
    <BackgroundContainer>
      <MobileContainer>
        <HeaderBar/>
        <ChatContainer>
          <DateBadge/>
          
          {/* MicrophoneDemo Component */}
          <MicrophoneDemo onTranscript={handleTranscript} />
          
          {/* Original Chat Component */}
          <Chat />

          <BottomBar
            onSendMessage={() => {}}
            isLoading={false}
            isRecording={false}
            micDisabled={false}
            micError={false}
          />
        </ChatContainer>
      </MobileContainer>
    </BackgroundContainer>
  )
}