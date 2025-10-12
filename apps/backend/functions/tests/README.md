# Calendar API Tests

This directory contains comprehensive tests for the Calendar API endpoints and services.

## Test Structure

```
tests/
├── api/
│   ├── schedule.test.ts          # Tests for POST /schedule endpoint
│   ├── calendar.test.ts          # Tests for calendar CRUD operations
│   └── natural-language-handler.test.ts # Tests for NaturalLanguageHandler service
├── utils/
│   ├── setup.ts                 # Test setup and mocks
│   └── test-config.ts           # Test configuration and utilities
└── index.test.ts                # Test suite runner
```

## Test Coverage

### POST /schedule Endpoint Tests
- ✅ Valid natural language input processing
- ✅ Japanese language support
- ✅ Complex requests with attendees
- ✅ Recurring event requests
- ✅ Input validation (empty, invalid, too long)
- ✅ Error handling (GPT, Calendar, Validation, Auth)
- ✅ Integration flow verification
- ✅ Time zone handling
- ✅ Relative date expressions
- ✅ Response structure validation

### Calendar API Tests
- ✅ POST /calendar - Create event from natural language
- ✅ GET /calendar - Retrieve events with query parameters
- ✅ PUT /calendar/:id - Update events with validation
- ✅ DELETE /calendar/:id - Delete events
- ✅ Method not allowed handling
- ✅ Error handling and edge cases

### NaturalLanguageHandler Service Tests
- ✅ Complete request processing flow
- ✅ Update request handling
- ✅ Delete request handling
- ✅ Error handling for all service dependencies
- ✅ Service integration verification

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm run test:watch
```

### Run tests with coverage
```bash
pnpm run test:coverage
```

### Run tests for CI
```bash
pnpm run test:ci
```

## Test Configuration

Tests are configured using Jest with the following features:
- TypeScript support via ts-jest
- Firebase Functions mocking
- Service dependency mocking
- Comprehensive error simulation
- Async operation handling

## Mock Data

The tests use comprehensive mock data including:
- Mock user authentication
- Mock calendar events
- Mock natural language inputs (English & Japanese)
- Mock error scenarios
- Mock API responses

## Test Utilities

### Setup Utilities
- Firebase Functions mocking
- Service dependency mocking
- Request/Response mock creation
- Async operation helpers

### Test Configuration
- Test timeouts and settings
- Mock data generators
- Utility functions for test creation
- Common test patterns

## Coverage Goals

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## Test Scenarios

### Happy Path Tests
1. Natural language → EventJSON → Google Calendar
2. Valid input validation
3. Successful event creation
4. Proper response formatting

### Error Handling Tests
1. Invalid input validation
2. Service failure scenarios
3. Authentication errors
4. Network timeout handling

### Edge Case Tests
1. Empty inputs
2. Malformed data
3. Boundary conditions
4. Concurrent requests

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use descriptive test names
3. Include both positive and negative test cases
4. Mock all external dependencies
5. Verify error handling scenarios
6. Update this README if adding new test categories
