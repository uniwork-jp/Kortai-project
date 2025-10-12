# Services Tests

This directory contains comprehensive tests for the service layer components of the AI Assistant backend.

## Test Files

### `gpt-service.test.ts`
Tests for the `GPTService` class that handles natural language to structured data conversion.

**Test Coverage:**
- ✅ Constructor and initialization
- ✅ Natural language parsing with various input types
- ✅ Japanese language support
- ✅ Complex multi-part requests
- ✅ Edge cases (empty input, special characters, long text)
- ✅ Error handling (API errors, network timeouts, invalid JSON)
- ✅ Response validation (CalendarEvent structure, ISO dates, timezones)
- ✅ Performance testing (response time, concurrent requests)
- ✅ Mock implementation testing

**Key Test Scenarios:**
- Simple meeting requests
- Meetings with attendees
- Recurring events
- Appointments with specific times
- Events with locations
- Relative time expressions
- Multi-part complex requests

### `auth-service.test.ts`
Tests for the `AuthService` class that handles authentication and authorization.

**Test Coverage:**
- ✅ Constructor and initialization
- ✅ Google access token retrieval
- ✅ User authentication verification
- ✅ Access token refresh
- ✅ User scope management
- ✅ Permission checking
- ✅ Error handling for all methods
- ✅ Integration scenarios
- ✅ Performance testing
- ✅ Concurrent request handling

**Key Test Scenarios:**
- Token generation for different users
- Authentication verification
- Token refresh flow
- Scope validation
- Permission checking
- Complete authentication workflows

## Running Tests

### Run all service tests:
```bash
pnpm test tests/services/
```

### Run specific service tests:
```bash
# GPT Service tests only
pnpm test tests/services/gpt-service.test.ts

# Auth Service tests only
pnpm test tests/services/auth-service.test.ts
```

### Run with coverage:
```bash
pnpm test tests/services/ --coverage
```

## Test Structure

Each test file follows a consistent structure:

1. **Constructor Tests** - Verify proper initialization
2. **Valid Input Tests** - Test normal operation with various inputs
3. **Edge Case Tests** - Test boundary conditions and unusual inputs
4. **Error Handling Tests** - Verify proper error handling and messaging
5. **Response Validation Tests** - Ensure output matches expected interfaces
6. **Performance Tests** - Verify operations complete within reasonable time
7. **Integration Tests** - Test complete workflows and interactions
8. **Concurrent Tests** - Verify thread safety and concurrent operation

## Mock Implementations

Both services use mock implementations for development and testing:

- **GPTService**: Uses `mockGPTResponse()` to simulate GPT API responses
- **AuthService**: Uses mock methods for token management and authentication

These mocks allow testing without external API dependencies while maintaining realistic behavior patterns.

## Dependencies

The service tests depend on:
- `@ai-assistant/api-types` - For type definitions
- Jest testing framework
- TypeScript for type safety

## Future Enhancements

When implementing actual API integrations:

1. **GPTService**: Replace `mockGPTResponse()` with actual OpenAI API calls
2. **AuthService**: Replace mock methods with Firebase Authentication and Google Identity Platform integration
3. **Integration Tests**: Add tests with actual external services (in separate test environment)
4. **Performance Tests**: Add more sophisticated performance benchmarks
5. **Security Tests**: Add tests for authentication vulnerabilities and edge cases
