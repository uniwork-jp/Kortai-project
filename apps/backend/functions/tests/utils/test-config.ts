/**
 * Test configuration and utilities
 */

export const testConfig = {
  // Test timeouts
  timeout: 10000,
  
  // Mock data
  mockUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User'
  },
  
  mockEvent: {
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
  },
  
  mockNaturalLanguageInputs: [
    'Schedule a meeting tomorrow at 2 PM',
    'Create a reminder for dentist appointment next Friday at 10 AM',
    'Book a conference room for team meeting on Monday at 9 AM',
    '明日の午後2時に会議を予定してください',
    'Schedule a weekly standup every Monday at 9 AM for 30 minutes'
  ],
  
  mockErrorMessages: [
    'GPT API error',
    'Validation failed',
    'Calendar API error',
    'Authentication failed',
    'Network timeout'
  ]
};

export const testUtils = {
  // Generate mock date
  generateMockDate: (daysOffset: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString();
  },
  
  // Generate mock event ID
  generateMockEventId: () => `test-event-${Date.now()}`,
  
  // Generate mock access token
  generateMockAccessToken: () => `mock-access-token-${Date.now()}`,
  
  // Wait for async operations
  waitForAsync: () => new Promise(resolve => setImmediate(resolve)),
  
  // Create mock request
  createMockRequest: (overrides: any = {}) => ({
    body: {},
    headers: {
      'content-type': 'application/json',
      'user-id': 'test-user-id',
      ...overrides.headers
    },
    method: 'POST',
    path: '/schedule',
    query: {},
    params: {},
    ...overrides
  }),
  
  // Create mock response
  createMockResponse: () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    return res;
  }
};
