import { 
  LiffMockSDK, 
  LiffMockProfile, 
  LiffMockContext, 
  LiffMockConfig,
  DEFAULT_MOCK_USER,
  DEFAULT_MOCK_CONTEXT 
} from './types';

class MockLiffSDK implements LiffMockSDK {
  private config: LiffMockConfig;
  private isInitialized = false;
  private isLoggedInState = false;
  private accessToken: string | null = null;
  private idToken: string | null = null;
  private profile: LiffMockProfile | null = null;
  private context: LiffMockContext | null = null;

  constructor(config: LiffMockConfig) {
    this.config = {
      ...config,
      mockUserId: config.mockUserId || DEFAULT_MOCK_USER.userId,
      mockDisplayName: config.mockDisplayName || DEFAULT_MOCK_USER.displayName,
      mockPictureUrl: config.mockPictureUrl || DEFAULT_MOCK_USER.pictureUrl,
      mockStatusMessage: config.mockStatusMessage || DEFAULT_MOCK_USER.statusMessage,
      mockContext: config.mockContext || DEFAULT_MOCK_CONTEXT,
      enableMock: config.enableMock !== false
    };
  }

  async init(config: { liffId: string }): Promise<void> {
    if (!this.config.enableMock) {
      throw new Error('LIFF Mock is disabled. Set enableMock: true in config.');
    }

    console.log('🚀 LIFF Mock SDK initialized for local development');
    console.log('📱 Mock LIFF ID:', config.liffId);
    
    this.isInitialized = true;
    
    // Simulate initialization delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Auto-login in mock mode for convenience
    await this.login();
  }

  async login(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('LIFF SDK not initialized. Call init() first.');
    }

    console.log('🔐 LIFF Mock: User logged in');
    
    this.isLoggedInState = true;
    this.accessToken = `mock_access_token_${Date.now()}`;
    this.idToken = `mock_id_token_${Date.now()}`;
    
    this.profile = {
      userId: this.config.mockUserId!,
      displayName: this.config.mockDisplayName!,
      pictureUrl: this.config.mockPictureUrl,
      statusMessage: this.config.mockStatusMessage
    };
    
    this.context = this.config.mockContext!;
  }

  async logout(): Promise<void> {
    console.log('🚪 LIFF Mock: User logged out');
    
    this.isLoggedInState = false;
    this.accessToken = null;
    this.idToken = null;
    this.profile = null;
    this.context = null;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInState;
  }

  isInClient(): boolean {
    return this.config.enableMock ? true : false;
  }

  async getProfile(): Promise<LiffMockProfile> {
    if (!this.isLoggedInState || !this.profile) {
      throw new Error('User not logged in');
    }
    
    console.log('👤 LIFF Mock: Getting profile', this.profile);
    return this.profile;
  }

  async getContext(): Promise<LiffMockContext> {
    if (!this.context) {
      throw new Error('Context not available');
    }
    
    console.log('🌐 LIFF Mock: Getting context', this.context);
    return this.context;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getIDToken(): string | null {
    return this.idToken;
  }

  async sendMessages(messages: any[]): Promise<void> {
    console.log('💬 LIFF Mock: Sending messages', messages);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ LIFF Mock: Messages sent successfully');
  }

  openWindow(params: { url: string; external?: boolean }): void {
    console.log('🪟 LIFF Mock: Opening window', params);
    
    if (params.external) {
      window.open(params.url, '_blank');
    } else {
      window.location.href = params.url;
    }
  }

  closeWindow(): void {
    console.log('❌ LIFF Mock: Closing window');
    window.close();
  }

  get ready(): Promise<void> {
    return Promise.resolve();
  }
}

export default MockLiffSDK;
