import { NextResponse } from 'next/server'

// Check if we're in local development environment
const isLocalEnvironment = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true' ||
         process.env.NEXT_PUBLIC_LIFF_USE_MOCK === 'true'
}

// Mock server endpoint (Firebase Functions emulator)
const MOCK_SERVER_URL = 'http://localhost:5001/ai-assistant-dev/us-central1/testChat/message'

export async function GET() {
  return NextResponse.json({
    message: 'Test chat endpoint is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'healthy',
    environment: isLocalEnvironment() ? 'local' : 'production',
    mockServerEnabled: isLocalEnvironment()
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.message) {
      return NextResponse.json(
        { 
          error: 'VALIDATION_ERROR',
          message: 'Message field is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // If in local environment, hit the mock server
    if (isLocalEnvironment()) {
      try {
        console.log('🔄 Local environment detected - hitting mock server:', MOCK_SERVER_URL)
        
        const mockResponse = await fetch(MOCK_SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: body.message,
            userId: body.userId || 'test-user',
            category: body.category || 'test'
          }),
        })

        if (!mockResponse.ok) {
          console.warn('⚠️ Mock server not available, falling back to local mock')
          throw new Error('Mock server unavailable')
        }

        const mockData = await mockResponse.json()
        
        return NextResponse.json({
          success: mockData.success,
          messageId: mockData.messageId,
          originalMessage: mockData.originalMessage,
          aiResponse: mockData.aiResponse,
          timestamp: mockData.timestamp,
          userId: mockData.userId,
          category: mockData.category,
          source: 'mock-server'
        }, { status: 201 })

      } catch (mockError) {
        console.warn('⚠️ Mock server error, falling back to local mock:', mockError)
        // Fall through to local mock implementation
      }
    }

    // Local mock implementation (fallback or non-local environment)
    const responses = [
      'I understand your test message. This is a mock response.',
      'Test message received! Here\'s a sample AI response.',
      'Hello! I\'m responding to your test message.',
      'Test successful! This is a simulated AI response.',
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    const testChatResponse = {
      success: true,
      messageId: `test-msg-${Date.now()}`,
      originalMessage: body.message,
      aiResponse: randomResponse,
      timestamp: new Date().toISOString(),
      userId: body.userId || 'test-user',
      category: body.category || 'test',
      source: 'local-mock'
    }

    return NextResponse.json(testChatResponse, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'INVALID_JSON',
        message: 'Invalid JSON in request body',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }
}
