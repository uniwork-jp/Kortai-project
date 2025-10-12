/**
 * Test Chat Functionality
 * 
 * This file contains test chat endpoints for development and testing purposes.
 */

import * as functions from 'firebase-functions';
import cors from 'cors';
import express from 'express';

// Initialize Express app for test chat
const testChatApp = express();
testChatApp.use(cors({ origin: true }));
testChatApp.use(express.json());

// Test chat interfaces
interface TestChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  category: 'test' | 'debug' | 'development';
}

interface TestChatResponse {
  success: boolean;
  messageId: string;
  originalMessage: string;
  aiResponse: string;
  timestamp: string;
  userId: string;
  category: string;
}

// Mock test responses
const testResponses = [
  'This is a test response from the backend.',
  'Test message received! Backend is working correctly.',
  'Hello! This is a simulated AI response for testing.',
  'Test successful! Backend test-chat endpoint is functional.',
  'Debug mode: Test chat endpoint is responding properly.',
];

// Test chat endpoints

// Health check for test chat
testChatApp.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Test Chat API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'test'
  });
});

// Send test chat message
testChatApp.post('/message', async (req, res) => {
  try {
    const { userId = 'test-user', message, category = 'test' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Message field is required',
        timestamp: new Date().toISOString()
      });
    }

    // Generate random test response
    const randomResponse = testResponses[Math.floor(Math.random() * testResponses.length)];
    
    const testMessage: TestChatMessage = {
      id: `test-msg-${Date.now()}`,
      userId,
      message,
      response: randomResponse,
      timestamp: new Date(),
      category
    };

    const response: TestChatResponse = {
      success: true,
      messageId: testMessage.id,
      originalMessage: testMessage.message,
      aiResponse: testMessage.response,
      timestamp: testMessage.timestamp.toISOString(),
      userId: testMessage.userId,
      category: testMessage.category
    };

    res.status(201).json(response);
    return;
  } catch (error) {
    console.error('Error in test chat:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to process test chat message',
      timestamp: new Date().toISOString()
    });
    return;
  }
});

// Get test chat history (mock)
testChatApp.get('/history', async (req, res) => {
  try {
    const { userId = 'test-user', limit = 10 } = req.query;
    
    // Mock test chat history
    const mockHistory: TestChatMessage[] = [
      {
        id: 'test-msg-1',
        userId: userId as string,
        message: 'Test message 1',
        response: 'Test response 1',
        timestamp: new Date(Date.now() - 60000),
        category: 'test'
      },
      {
        id: 'test-msg-2',
        userId: userId as string,
        message: 'Test message 2',
        response: 'Test response 2',
        timestamp: new Date(Date.now() - 30000),
        category: 'test'
      }
    ];

    res.json({
      success: true,
      data: mockHistory.slice(0, parseInt(limit as string)),
      count: mockHistory.length,
      userId: userId as string
    });
  } catch (error) {
    console.error('Error fetching test chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test chat history'
    });
  }
});

// Export test chat function
export const testChat = functions.https.onRequest(testChatApp);

// Individual test chat functions
export const testChatHealth = functions.https.onRequest((req, res) => {
  res.json({
    status: 'healthy',
    service: 'Test Chat Health Check',
    timestamp: new Date().toISOString(),
    environment: 'test'
  });
});

export const testChatMessage = functions.https.onCall(async (data, context) => {
  try {
    const { message, userId = 'test-user', category = 'test' } = data;
    
    if (!message) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Message field is required'
      );
    }

    const randomResponse = testResponses[Math.floor(Math.random() * testResponses.length)];
    
    return {
      success: true,
      messageId: `test-msg-${Date.now()}`,
      originalMessage: message,
      aiResponse: randomResponse,
      timestamp: new Date().toISOString(),
      userId,
      category
    };
  } catch (error) {
    console.error('Error in test chat callable:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to process test chat message'
    );
  }
});
