import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import MockLiffSDK from './mockLiffSDK';
import { LiffMockConfig, LiffMockEnvironment, LiffMockProfile, LiffMockContext as LiffMockContextType } from './types';

interface LiffMockContextValue {
  liff: MockLiffSDK | null;
  environment: LiffMockEnvironment | null;
  profile: LiffMockProfile | null;
  context: LiffMockContextType | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
  error: string | null;
  initLiff: (liffId: string) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const LiffMockContext = createContext<LiffMockContextValue | null>(null);

interface LiffMockProviderProps {
  children: ReactNode;
  config?: LiffMockConfig;
}

export const LiffMockProvider: React.FC<LiffMockProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const [liff, setLiff] = useState<MockLiffSDK | null>(null);
  const [environment, setEnvironment] = useState<LiffMockEnvironment | null>(null);
  const [profile, setProfile] = useState<LiffMockProfile | null>(null);
  const [context, setContext] = useState<LiffMockContextType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initLiff = async (liffId: string): Promise<void> => {
    try {
      setError(null);
      
      const mockLiff = new MockLiffSDK({
        ...config,
        liffId,
        enableMock: true
      });
      
      await mockLiff.init({ liffId });
      
      setLiff(mockLiff);
      setIsInitialized(true);
      setIsLoggedIn(mockLiff.isLoggedIn());
      
      // Update environment
      setEnvironment({
        isInClient: mockLiff.isInClient(),
        isLoggedIn: mockLiff.isLoggedIn(),
        isApiAvailable: true,
        context: await mockLiff.getContext(),
        profile: await mockLiff.getProfile()
      });
      
      // Set profile and context
      setProfile(await mockLiff.getProfile());
      setContext(await mockLiff.getContext());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize LIFF Mock';
      setError(errorMessage);
      console.error('LIFF Mock initialization error:', err);
    }
  };

  const login = async (): Promise<void> => {
    if (!liff) {
      throw new Error('LIFF Mock not initialized');
    }
    
    try {
      await liff.login();
      setIsLoggedIn(true);
      
      // Update profile and context after login
      const profile = await liff.getProfile();
      const context = await liff.getContext();
      setProfile(profile);
      setContext(context);
      
      setEnvironment(prev => prev ? {
        ...prev,
        isLoggedIn: true,
        profile,
        context
      } : null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    if (!liff) {
      throw new Error('LIFF Mock not initialized');
    }
    
    try {
      await liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
      setContext(null);
      
      setEnvironment(prev => prev ? {
        ...prev,
        isLoggedIn: false,
        profile: undefined
      } : null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  };

  const contextValue: LiffMockContextValue = {
    liff,
    environment,
    profile,
    context,
    isInitialized,
    isLoggedIn,
    error,
    initLiff,
    login,
    logout
  };

  return (
    <LiffMockContext.Provider value={contextValue}>
      {children}
    </LiffMockContext.Provider>
  );
};

export const useLiffMock = (): LiffMockContextValue => {
  const context = useContext(LiffMockContext);
  if (!context) {
    throw new Error('useLiffMock must be used within a LiffMockProvider');
  }
  return context;
};

// Hook for environment detection
export const useIsLocalDevelopment = (): boolean => {
  return typeof window !== 'undefined' && 
         (window.location.hostname === 'localhost' || 
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.includes('local'));
};

// Hook for conditional LIFF usage
export const useLiffConditional = () => {
  const isLocal = useIsLocalDevelopment();
  const liffMock = useLiffMock();
  
  return {
    isLocal,
    shouldUseMock: isLocal,
    liff: liffMock.liff,
    profile: liffMock.profile,
    isLoggedIn: liffMock.isLoggedIn,
    initLiff: liffMock.initLiff,
    login: liffMock.login,
    logout: liffMock.logout
  };
};
