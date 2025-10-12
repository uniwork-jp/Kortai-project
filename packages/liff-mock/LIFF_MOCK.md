# LIFF Mock Provider

A mock provider for LINE LIFF SDK designed for local development of AI Assistant applications.

## 🎯 Purpose

This package provides a mock implementation of the LINE LIFF SDK that automatically activates when running in local development environments, allowing you to develop and test your LIFF applications without requiring actual LINE integration.

## 📦 Installation

```bash
# Install the package
pnpm add @ai-assistant/liff-mock
```

## 🚀 Quick Start

### 1. Wrap your app with the provider

```tsx
import { LiffMockProvider } from '@ai-assistant/liff-mock';

function App() {
  return (
    <LiffMockProvider>
      <YourApp />
    </LiffMockProvider>
  );
}
```

### 2. Use the hook in your components

```tsx
import { useLiffConditional } from '@ai-assistant/liff-mock';

function ChatComponent() {
  const { 
    isLocal, 
    shouldUseMock, 
    profile, 
    isLoggedIn, 
    initLiff, 
    login, 
    logout 
  } = useLiffConditional();

  useEffect(() => {
    if (shouldUseMock) {
      initLiff('your-liff-id');
    } else {
      // Use real LIFF SDK
      liff.init({ liffId: 'your-liff-id' });
    }
  }, [shouldUseMock]);

  if (!isLoggedIn) {
    return <button onClick={login}>Login</button>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.displayName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔧 Configuration

### Basic Configuration

```tsx
import { LiffMockProvider, createMockLiffConfig } from '@ai-assistant/liff-mock';

const mockConfig = createMockLiffConfig({
  mockUserId: 'custom_user_123',
  mockDisplayName: 'Custom Mock User',
  mockPictureUrl: 'https://example.com/avatar.jpg',
  mockStatusMessage: 'Custom status message'
});

function App() {
  return (
    <LiffMockProvider config={mockConfig}>
      <YourApp />
    </LiffMockProvider>
  );
}
```

### Advanced Configuration

```tsx
const advancedConfig = {
  liffId: 'your-liff-id',
  mockUserId: 'dev_user_456',
  mockDisplayName: 'Development User',
  mockPictureUrl: 'https://via.placeholder.com/150x150/2196F3/FFFFFF?text=Dev',
  mockStatusMessage: 'Working on AI Assistant',
  mockContext: {
    type: 'group' as const,
    groupId: 'mock_group_123'
  },
  enableMock: true
};
```

## 🎣 Available Hooks

### `useLiffMock()`
Access the full mock LIFF context.

```tsx
const {
  liff,           // MockLiffSDK instance
  environment,    // Mock environment data
  profile,        // Mock user profile
  context,        // Mock LIFF context
  isInitialized,  // Initialization status
  isLoggedIn,     // Login status
  error,          // Error message if any
  initLiff,       // Initialize function
  login,          // Login function
  logout          // Logout function
} = useLiffMock();
```

### `useLiffConditional()`
Smart hook that automatically detects environment and provides appropriate LIFF functionality.

```tsx
const {
  isLocal,        // true if running locally
  shouldUseMock,  // true if should use mock
  liff,           // LIFF instance (mock or real)
  profile,        // User profile
  isLoggedIn,     // Login status
  initLiff,       // Initialize function
  login,          // Login function
  logout          // Logout function
} = useLiffConditional();
```

### `useIsLocalDevelopment()`
Simple hook to detect local development environment.

```tsx
const isLocal = useIsLocalDevelopment();
// Returns true if hostname is localhost, 127.0.0.1, or contains 'local'
```

## 🛠️ Mock Features

### Automatic Environment Detection
- Automatically detects local development environments
- Only activates when running on localhost or 127.0.0.1
- Can be manually enabled/disabled via configuration

### Mock User Data
- Configurable mock user profile
- Realistic user data for testing
- Customizable avatar, display name, and status message

### Mock LIFF Context
- Simulates different LIFF contexts (utou, room, group, none)
- Configurable context parameters
- Realistic context switching for testing

### Console Logging
- Detailed console logs for debugging
- Clear indication when mock is active
- Helpful development information

## 🔄 Migration from Real LIFF

### Before (Real LIFF)
```tsx
import liff from '@line/liff';

useEffect(() => {
  liff.init({ liffId: 'your-liff-id' });
}, []);
```

### After (With Mock Support)
```tsx
import { useLiffConditional } from '@ai-assistant/liff-mock';

function MyComponent() {
  const { initLiff, shouldUseMock } = useLiffConditional();
  
  useEffect(() => {
    initLiff('your-liff-id');
  }, []);
}
```

## 🧪 Testing

The mock provider includes comprehensive testing utilities:

```tsx
import { createMockLiffConfig, logLiffMockInfo } from '@ai-assistant/liff-mock';

// Log mock information for debugging
logLiffMockInfo();

// Create test configurations
const testConfig = createMockLiffConfig({
  mockUserId: 'test_user',
  mockDisplayName: 'Test User'
});
```

## 🚨 Important Notes

1. **Environment Detection**: The mock only activates in local development environments
2. **Production Safety**: Always test with real LIFF SDK before deploying
3. **Configuration**: Mock settings don't affect production builds
4. **Performance**: Mock operations are synchronous for faster development

## 🔗 Integration with AI Assistant

This package is specifically designed for the AI Assistant project and integrates seamlessly with:

- Firebase Authentication
- Next.js applications
- React components
- TypeScript projects

