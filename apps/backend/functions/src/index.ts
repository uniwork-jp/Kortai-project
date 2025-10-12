/**
 * Firebase Functions - AI Assistant API
 * 
 * This file contains API endpoints for the AI Assistant application
 * using Firebase Functions and Firestore integration.
 * Aligned with OpenAPI schema.yaml specifications.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';
import express from 'express';

// Import types from @api-types package
import {
  ValidationResponse,
  CalendarEvent,
  SuccessResponse,
  ErrorResponse
} from '@ai-assistant/api-types';

// Define ApiResponse locally to ensure it includes count
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// Import Zod schemas for validation
import {
  NaturalLanguageInputSchema,
  ValidationResponseSchema,
  CalendarEventSchema,
  EventUpdateInputSchema
} from '@ai-assistant/api-types';

// Import calendar services (for future use)
// import { NaturalLanguageHandler } from './api/calendar/NaturalLanguageHandler';
// import { CalendarService } from './api/calendar/CalendarService';

// Import test chat functionality
import { testChat, testChatHealth, testChatMessage } from './test-chat';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Firestore
// const db = admin.firestore(); // Uncomment when using Firestore

// Initialize Express app with CORS
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Legacy interfaces for backward compatibility
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  category: 'general' | 'technical' | 'support';
}

interface AIResponse {
  id: string;
  prompt: string;
  response: string;
  model: string;
  tokens: number;
  timestamp: Date;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    userId: 'user-1',
    message: 'Hello, how can I help you today?',
    response: 'Hello! I\'m here to assist you with any questions you might have.',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    category: 'general',
  },
  {
    id: 'msg-2',
    userId: 'user-2',
    message: 'Can you explain machine learning?',
    response: 'Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.',
    timestamp: new Date('2024-01-15T11:00:00Z'),
    category: 'technical',
  },
];

const mockAIResponses: AIResponse[] = [
  {
    id: 'ai-1',
    prompt: 'What is artificial intelligence?',
    response: 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans.',
    model: 'gpt-3.5-turbo',
    tokens: 25,
    timestamp: new Date('2024-01-15T12:00:00Z'),
  },
];

// Helper function to generate mock data
function generateMockData() {
  return {
    users: mockUsers,
    chatMessages: mockChatMessages,
    aiResponses: mockAIResponses,
  };
}

// Initialize services (for future use)
// const naturalLanguageHandler = new NaturalLanguageHandler();
// const calendarService = new CalendarService();

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============================================================================
// SCHEDULE ENDPOINTS (Calendar Integration)
// ============================================================================

// POST /schedule - Validate calendar event creation from natural language
app.post('/schedule', async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validationResult = NaturalLanguageInputSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid input',
        code: 'INVALID_REQUEST',
        details: validationResult.error.errors
      } as ErrorResponse);
    }
    
    const { text } = validationResult.data;
    
    // Mock validation - in real implementation, this would use GPT to parse
    const isValid = text.length > 0 && text.length < 1000;
    
    const response: ValidationResponse = {
      valid: isValid,
      message: isValid ? 'イベント作成可能' : '自然言語の解析に失敗しました'
    };
    
    // Validate response using Zod schema
    const responseValidation = ValidationResponseSchema.safeParse(response);
    if (!responseValidation.success) {
      console.error('Response validation failed:', responseValidation.error);
    }
    
    res.json(response);
    return;
  } catch (error) {
    console.error('Error validating schedule creation:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'VALIDATION_ERROR'
    } as ErrorResponse);
    return;
  }
});

// GET /schedule - Get scheduled events
app.get('/schedule', async (req, res) => {
  try {
    // Validate query parameters using Zod schema
    // TODO: Add GetEventsQuerySchema when available
    // const queryValidation = GetEventsQuerySchema.safeParse(req.query);
    
    // For now, skip query validation
    // if (!queryValidation.success) {
    //   return res.status(400).json({
    //     error: 'Invalid query parameters',
    //     code: 'INVALID_QUERY',
    //     details: queryValidation.error.errors
    //   } as ErrorResponse);
    // }
    
    // const query = queryValidation.data;
    
    // Mock implementation - in real app, this would fetch from Google Calendar
    const mockEvents: CalendarEvent[] = [
      {
        kind: 'calendar#event',
        etag: '\"1234567890\"',
        id: 'event_123',
        summary: '会議',
        description: 'プロジェクト会議',
        location: '会議室A',
        start: {
          dateTime: '2024-01-15T14:00:00+09:00',
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: '2024-01-15T15:00:00+09:00',
          timeZone: 'Asia/Tokyo'
        },
        status: 'confirmed'
      }
    ];
    
    // Validate response using Zod schema
    const eventsValidation = CalendarEventSchema.array().safeParse(mockEvents);
    if (!eventsValidation.success) {
      console.error('Events validation failed:', eventsValidation.error);
    }
    return;
  } catch (error) {
    console.error('Error fetching scheduled events:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'FETCH_EVENTS_ERROR'
    } as ErrorResponse);
    return;
  }
});

// DELETE /schedule/:event_id - Delete a scheduled event
app.delete('/schedule/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;
    
    if (!event_id) {
      return res.status(400).json({
        error: 'Event ID is required',
        code: 'MISSING_EVENT_ID'
      } as ErrorResponse);
    }
    
    // Mock implementation - in real app, this would delete from Google Calendar
    console.log(`Mock: Deleting event ${event_id}`);
    
    const response: SuccessResponse = {
      success: true,
      message: '操作が正常に完了しました'
    };
    
    res.json(response);
    return;
  } catch (error) {
    console.error('Error deleting scheduled event:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'DELETE_EVENT_ERROR'
    } as ErrorResponse);
    return;
  }
});

// PATCH /schedule/:event_id - Update a scheduled event
app.patch('/schedule/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;
    // Validate request body using Zod schema
    const updateValidation = EventUpdateInputSchema.safeParse(req.body);
    
    if (!updateValidation.success) {
      return res.status(400).json({
        error: 'Invalid update data',
        code: 'INVALID_UPDATE_DATA',
        details: updateValidation.error.errors
      } as ErrorResponse);
    }
    
    const updateData = updateValidation.data;
    
    if (!event_id) {
      return res.status(400).json({
        error: 'Event ID is required',
        code: 'MISSING_EVENT_ID'
      } as ErrorResponse);
    }
    
    // Mock implementation - in real app, this would update Google Calendar
    console.log(`Mock: Updating event ${event_id}`, updateData);
    
    const updatedEvent: CalendarEvent = {
      kind: 'calendar#event',
      etag: '\"1234567890\"',
      id: event_id,
      summary: updateData.title || 'Updated Event',
      description: updateData.description,
      location: updateData.location,
      start: {
        dateTime: updateData.start || '2024-01-15T14:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: updateData.end || '2024-01-15T15:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      status: 'confirmed'
    };
    
    // Validate response using Zod schema
    const responseValidation = CalendarEventSchema.safeParse(updatedEvent);
    if (!responseValidation.success) {
      console.error('Updated event validation failed:', responseValidation.error);
    }
    return;
  } catch (error) {
    console.error('Error updating scheduled event:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'UPDATE_EVENT_ERROR'
    } as ErrorResponse);
    return;
  }
});

// ============================================================================
// LEGACY ENDPOINTS (for backward compatibility)
// ============================================================================

// Get all users (Legacy endpoint)
app.get('/api/users', async (req, res) => {
  try {
    // In a real app, you'd fetch from Firestore
    // const usersSnapshot = await db.collection('users').get();
    // const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const mockData = generateMockData();
    const response: ApiResponse<User[]> = {
      success: true,
      data: mockData.users,
      count: mockData.users.length,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    } as ApiResponse);
  }
});

// Get user by ID (Legacy endpoint)
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mockData = generateMockData();
    const user = mockData.users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      } as ApiResponse);
    }
    
    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };
    res.json(response);
    return;
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    } as ApiResponse);
    return;
  }
});

// Create new user (Legacy endpoint)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role = 'user' } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      } as ApiResponse);
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // In a real app, you'd save to Firestore
    // await db.collection('users').doc(newUser.id).set(newUser);
    
    const response: ApiResponse<User> = {
      success: true,
      data: newUser,
    };
    res.status(201).json(response);
    return;
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    } as ApiResponse);
    return;
  }
});

// Get chat messages (Legacy endpoint)
app.get('/api/chat', async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    const mockData = generateMockData();
    
    let messages = mockData.chatMessages;
    
    if (userId) {
      messages = messages.filter(msg => msg.userId === userId);
    }
    
    messages = messages.slice(0, parseInt(limit as string));
    
    const response: ApiResponse<ChatMessage[]> = {
      success: true,
      data: messages,
      count: messages.length,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat messages',
    } as ApiResponse);
  }
});

// Send chat message (Legacy endpoint)
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message, category = 'general' } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'User ID and message are required',
      } as ApiResponse);
    }
    
    // Mock AI response
    const responses = [
      'I understand your question. Let me help you with that.',
      'That\'s an interesting point. Here\'s what I think...',
      'I can assist you with that. Let me provide some information.',
      'Great question! Here\'s my response...',
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId,
      message,
      response: randomResponse,
      timestamp: new Date(),
      category,
    };
    
    // In a real app, you'd save to Firestore
    // await db.collection('chatMessages').doc(newMessage.id).set(newMessage);
    
    const response: ApiResponse<ChatMessage> = {
      success: true,
      data: newMessage,
    };
    res.status(201).json(response);
    return;
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send chat message',
    } as ApiResponse);
    return;
  }
});

// Get AI responses (Legacy endpoint)
app.get('/api/ai-responses', async (req, res) => {
  try {
    const { model, limit = 10 } = req.query;
    const mockData = generateMockData();
    
    let responses = mockData.aiResponses;
    
    if (model) {
      responses = responses.filter(resp => resp.model === model);
    }
    
    responses = responses.slice(0, parseInt(limit as string));
    
    const response: ApiResponse<AIResponse[]> = {
      success: true,
      data: responses,
      count: responses.length,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching AI responses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI responses',
    } as ApiResponse);
  }
});

// Generate AI response (Legacy endpoint)
app.post('/api/ai-responses', async (req, res) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      } as ApiResponse);
    }
    
    // Mock AI response generation
    const mockResponses = [
      'This is a mock response to your prompt. In a real implementation, this would be generated by an AI model.',
      'I understand your request. Here\'s a simulated AI response based on your input.',
      'Based on your prompt, here\'s what an AI model might respond with.',
      'This is a placeholder response that would be replaced with actual AI-generated content.',
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    const newAIResponse: AIResponse = {
      id: `ai-${Date.now()}`,
      prompt,
      response: randomResponse,
      model,
      tokens: Math.floor(Math.random() * 100) + 10,
      timestamp: new Date(),
    };
    
    // In a real app, you'd save to Firestore
    // await db.collection('aiResponses').doc(newAIResponse.id).set(newAIResponse);
    
    const response: ApiResponse<AIResponse> = {
      success: true,
      data: newAIResponse,
    };
    res.status(201).json(response);
    return;
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response',
    } as ApiResponse);
    return;
  }
});

// Export the Express app as a Firebase Function
// Export the Express app for testing
export { app };

// Export Firebase Function
export const api = functions.https.onRequest(app);

// Individual function exports for specific endpoints
export const healthCheck = functions.https.onRequest((req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI Assistant API',
  });
});

// Firestore trigger example
export const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    console.log('New user created:', context.params.userId, userData);
    
    // You can add additional logic here, such as:
    // - Send welcome email
    // - Initialize user preferences
    // - Create user-specific collections
    
    return null;
  });

// Scheduled function example
export const dailyCleanup = functions.pubsub
  .schedule('0 2 * * *') // Run at 2 AM every day
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Running daily cleanup...');
    
    // Add cleanup logic here, such as:
    // - Delete old temporary files
    // - Clean up expired sessions
    // - Generate daily reports
    
    return null;
  });

// Export test chat functions
export { testChat, testChatHealth, testChatMessage };
