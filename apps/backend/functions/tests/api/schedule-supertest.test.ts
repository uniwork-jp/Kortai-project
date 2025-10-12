/**
 * Tests for POST /schedule endpoint using supertest
 * Tests the validation endpoint behavior
 */

import request from 'supertest';
import { app } from '../../src/index';

describe('POST /schedule endpoint', () => {
  describe('Valid requests', () => {
    it('should accept natural language input and validate calendar event creation', async () => {
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
    });
  });

  describe('Validation flow', () => {
    it('should validate natural language input correctly', async () => {
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
    it('should return properly structured validation response', async () => {
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

    it('should return valid validation response for different inputs', async () => {
      // Arrange
      const testCases = [
        'Schedule a meeting tomorrow',
        'Create an event next Monday',
        'Book a conference room for Friday',
        'Set up a reminder for next week'
      ];

      // Act & Assert
      for (const text of testCases) {
        const response = await request(app)
          .post('/schedule')
          .send({ text })
          .set('Content-Type', 'application/json')
          .set('user-id', 'test-user-id');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('valid', true);
        expect(response.body).toHaveProperty('message');
      }
    });
  });
});