# AI Assistant Firebase Functions - Mock API

This directory contains Firebase Functions that provide mock API endpoints for the AI Assistant application.

## Setup

1. Install dependencies:
```bash
cd apps/backend/functions
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start the Firebase emulators:
```bash
npm run serve
```

## Available Endpoints

### Health Check
- **GET** `/health` - Check API health status

### Users API
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user

### Chat API
- **GET** `/api/chat` - Get chat messages (supports `userId` and `limit` query params)
- **POST** `/api/chat` - Send new chat message

### AI Responses API
- **GET** `/api/ai-responses` - Get AI responses (supports `model` and `limit` query params)
- **POST** `/api/ai-responses` - Generate new AI response

## Example Usage

### Get all users
```bash
curl http://localhost:5001/your-project-id/us-central1/api/api/users
```

### Create a new user
```bash
curl -X POST http://localhost:5001/your-project-id/us-central1/api/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "role": "user"}'
```

### Send a chat message
```bash
curl -X POST http://localhost:5001/your-project-id/us-central1/api/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-1", "message": "Hello, how are you?", "category": "general"}'
```

### Generate AI response
```bash
curl -X POST http://localhost:5001/your-project-id/us-central1/api/api/ai-responses \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is artificial intelligence?", "model": "gpt-3.5-turbo"}'
```

## Mock Data

The API includes pre-populated mock data:
- 2 sample users (John Doe and Jane Smith)
- 2 sample chat messages
- 1 sample AI response

## Firebase Integration

The functions are set up to work with:
- **Firestore**: For data persistence (currently using mock data)
- **Firebase Auth**: For user authentication
- **Firebase Emulators**: For local development

## Development

- **Build**: `npm run build`
- **Watch**: `npm run build:watch`
- **Serve**: `npm run serve`
- **Deploy**: `npm run deploy`

## Environment Variables

Set these environment variables for production:
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account key
- `FIREBASE_PROJECT_ID` - Your Firebase project ID

## Firestore Triggers

The functions include example Firestore triggers:
- `onUserCreate` - Triggered when a new user document is created
- `dailyCleanup` - Scheduled function that runs daily at 2 AM UTC
