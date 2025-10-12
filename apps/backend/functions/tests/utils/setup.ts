/**
 * Test setup utilities for Firebase Functions tests
 */

// Mock Firebase Functions
jest.mock('firebase-functions', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  https: {
    onRequest: jest.fn((handler) => handler),
    onCall: jest.fn((handler) => handler),
  },
  firestore: {
    document: jest.fn(() => ({
      onCreate: jest.fn((handler) => handler),
      onUpdate: jest.fn((handler) => handler),
      onDelete: jest.fn((handler) => handler),
    })),
  },
  pubsub: {
    schedule: jest.fn(() => ({
      timeZone: jest.fn(() => ({
        onRun: jest.fn((handler) => handler),
      })),
    })),
  },
}));

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      get: jest.fn(),
      add: jest.fn(),
    })),
  })),
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
    createCustomToken: jest.fn(),
  })),
}));

// Mock external services
jest.mock('../../src/services/AuthService', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    getGoogleAccessToken: jest.fn().mockResolvedValue('mock-access-token'),
  })),
}));

jest.mock('../../src/services/GPTService', () => ({
  GPTService: jest.fn().mockImplementation(() => ({
    parseToEvent: jest.fn().mockResolvedValue({
      kind: 'calendar#event',
      etag: '"1234567890"',
      id: 'test-event-id',
      summary: 'Test Event',
      description: 'Test Description',
      start: {
        dateTime: '2024-01-15T14:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: '2024-01-15T15:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      attendees: []
    }),
  })),
}));

// Mock calendar services
jest.mock('../../src/api/calendar/CalendarService', () => ({
  CalendarService: jest.fn().mockImplementation(() => ({
    createEvent: jest.fn().mockResolvedValue('mock-event-id'),
    updateEvent: jest.fn().mockResolvedValue('mock-event-id'),
    deleteEvent: jest.fn().mockResolvedValue(undefined),
    getEvents: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock('../../src/api/calendar/EventValidator', () => ({
  EventValidator: jest.fn().mockImplementation(() => ({
    validate: jest.fn().mockImplementation((event: any) => Promise.resolve(event)),
    normalizeDates: jest.fn().mockImplementation((event: any) => Promise.resolve(event)),
  })),
}));

jest.mock('../../src/api/calendar/NaturalLanguageHandler', () => ({
  NaturalLanguageHandler: jest.fn().mockImplementation(() => ({
    handleRequest: jest.fn().mockResolvedValue({
      kind: 'calendar#event',
      etag: '"1234567890"',
      id: 'test-event-id',
      summary: 'Test Event',
      description: 'Test Description',
      start: {
        dateTime: '2024-01-15T14:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: '2024-01-15T15:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      attendees: []
    }),
  })),
}));

// Test utilities
export const createMockRequest = (body: any, headers: Record<string, string> = {}) => ({
  body,
  headers: {
    'content-type': 'application/json',
    'user-id': 'test-user-id',
    ...headers,
  },
  method: 'POST',
  path: '/schedule',
  query: {},
});

import { Writable } from 'stream';

export const createMockResponse = () => {
  // Create a proper Node.js stream-like object
  const stream = new Writable({
    write(chunk, encoding, callback) {
      callback();
    }
  });

  const res: any = Object.assign(stream, {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    on: jest.fn(),
    end: jest.fn(),
    writeHead: jest.fn(),
    write: jest.fn(),
    setHeader: jest.fn(),
    getHeader: jest.fn(),
    removeHeader: jest.fn(),
    headersSent: false,
    statusCode: 200,
  });
  
  return res;
};

export const waitForAsync = () => new Promise(resolve => setImmediate(resolve));
