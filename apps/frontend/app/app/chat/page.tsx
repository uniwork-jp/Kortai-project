import { BackgroundContainer, MobileContainer } from '@ai-assistant/components'
import { lazy, Suspense } from 'react'

const Chat = lazy(() => import('./Chat'))

export default function ChatPage() {
  return (
    <BackgroundContainer>
      <MobileContainer maxWidth={460}>
        <Suspense fallback={<div>Loading ...</div>}>
          <Chat />
        </Suspense>
      </MobileContainer>
    </BackgroundContainer>
  )
}