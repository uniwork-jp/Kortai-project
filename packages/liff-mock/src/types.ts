// LIFF Mock Types - Compatible with @line/liff SDK

export interface LiffMockUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffMockProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffMockContext {
  type: 'utou' | 'room' | 'group' | 'none';
  userId?: string;
  groupId?: string;
  roomId?: string;
}

export interface LiffMockEnvironment {
  isInClient: boolean;
  isLoggedIn: boolean;
  isApiAvailable: boolean;
  context: LiffMockContext;
  profile?: LiffMockProfile;
}

export interface LiffMockConfig {
  liffId: string;
  mockUserId?: string;
  mockDisplayName?: string;
  mockPictureUrl?: string;
  mockStatusMessage?: string;
  mockContext?: LiffMockContext;
  enableMock?: boolean;
}

export interface LiffMockSDK {
  init: (config: { liffId: string }) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
  isInClient: () => boolean;
  getProfile: () => Promise<LiffMockProfile>;
  getContext: () => Promise<LiffMockContext>;
  getAccessToken: () => string | null;
  getIDToken: () => string | null;
  sendMessages: (messages: any[]) => Promise<void>;
  openWindow: (params: { url: string; external?: boolean }) => void;
  closeWindow: () => void;
  ready: Promise<void>;
}

// Mock data for development
export const DEFAULT_MOCK_USER: LiffMockUser = {
  userId: 'mock_user_123',
  displayName: 'Mock User',
  pictureUrl: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=Mock',
  statusMessage: 'This is a mock user for local development'
};

export const DEFAULT_MOCK_CONTEXT: LiffMockContext = {
  type: 'none',
  userId: 'mock_user_123'
};
