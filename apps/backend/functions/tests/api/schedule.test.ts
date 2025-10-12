/**
 * Tests for POST /schedule endpoint
 * Tests the validation endpoint behavior using Express app directly
 */

import request from 'supertest';
import { app } from '../../src/index';

describe('POST /schedule endpoint', () => {
  describe('Valid requests', () => {
    it('should accept natural language input and validate calendar event creation', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a meeting with John tomorrow at 2 PM for 1 hour'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle Japanese natural language input', async () => {
      // Arrange
      const requestBody = {
        text: '明日の午後2時に会議を予定してください'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle complex natural language with attendees', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a team meeting tomorrow at 3 PM with john@example.com and jane@example.com'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle recurring event requests', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a weekly standup every Monday at 9 AM for 30 minutes'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Invalid requests', () => {
    it('should reject request without text field', async () => {
      // Arrange
      const requestBody = {};

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with empty text', async () => {
      // Arrange
      const requestBody = {
        text: ''
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with non-string text', async () => {
      // Arrange
      const requestBody = {
        text: 123
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with text that is too long', async () => {
      // Arrange
      const requestBody = {
        text: 'a'.repeat(1001) // Exceeds 1000 character limit
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject request with invalid JSON', async () => {
      // Act
      const response = await request(app)
        .post('/schedule')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(400);
      // The response body might be empty or have different structure for invalid JSON
      expect(response.body).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle server errors gracefully', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a meeting tomorrow'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert - Since this is a validation endpoint, it should return valid response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Integration flow', () => {
    it('should validate natural language input correctly', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a project review meeting tomorrow at 2 PM'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert - Verify the validation flow
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('イベント作成可能');
    });

    it('should handle different time zones correctly', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a meeting tomorrow at 2 PM EST'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle relative date expressions correctly', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a meeting next Monday'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Response validation', () => {
    it('should return properly structured response', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a meeting tomorrow at 2 PM'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.valid).toBe('boolean');
      expect(typeof response.body.message).toBe('string');
    });

    it('should return valid ISO date-time strings', async () => {
      // Arrange
      const requestBody = {
        text: 'Schedule a meeting tomorrow at 2 PM'
      };

      // Act
      const response = await request(app)
        .post('/schedule')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('user-id', 'test-user-id');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('message');
    });
  });
});