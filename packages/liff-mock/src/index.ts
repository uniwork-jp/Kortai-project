// Main exports for LIFF Mock package
export { LiffMockProvider, useLiffMock, useIsLocalDevelopment, useLiffConditional } from './LiffMockProvider';
export { default as MockLiffSDK } from './mockLiffSDK';
export type {
  LiffMockUser,
  LiffMockProfile,
  LiffMockContext,
  LiffMockEnvironment,
  LiffMockConfig,
  LiffMockSDK
} from './types';
export { DEFAULT_MOCK_USER, DEFAULT_MOCK_CONTEXT } from './types';

// Import types for internal use
import type { LiffMockConfig } from './types';

// Utility functions
export const createMockLiffConfig = (overrides: Partial<LiffMockConfig> = {}): LiffMockConfig => ({
  liffId: 'mock-liff-id',
  mockUserId: 'mock_user_123',
  mockDisplayName: 'Mock User',
  mockPictureUrl: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=Mock',
  mockStatusMessage: 'This is a mock user for local development',
  mockContext: {
    type: 'none',
    userId: 'mock_user_123'
  },
  enableMock: true,
  ...overrides
});

// Development helpers
export const logLiffMockInfo = () => {
  console.log(`
🚀 LIFF Mock Package Info:
📦 Package: @ai-assistant/liff-mock
🔧 Purpose: Mock LIFF SDK for local development
🌐 Environment: ${typeof window !== 'undefined' ? 'Browser' : 'Server'}
🏠 Local Development: ${typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1') ? 'Yes' : 'No'}
  `);
};
