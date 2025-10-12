/**
 * Tests for calendar API endpoints
 * Tests all CRUD operations for calendar events
 */

// Jest globals are available without import
import { createMockRequest, createMockResponse, waitForAsync } from '../utils/setup';

// Import the calendar endpoint handler
import { calendar } from '../../src/api/calendar/index';

describe('Calendar API endpoints', () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = createMockRequest({});
    mockResponse = createMockResponse();
    jest.clearAllMocks();
  });

  describe('POST /calendar - Create Event', () => {
    it('should create calendar event from natural language', async () => {
      // Arrange
      mockRequest.method = 'POST';
      mockRequest.body = { text: 'Schedule a meeting tomorrow at 2 PM' };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Calendar event created successfully'
        })
      );
    });

    it('should handle invalid natural language input', async () => {
      // Arrange
      mockRequest.method = 'POST';
      mockRequest.body = { text: '' };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid input',
        code: 'INVALID_REQUEST',
        details: expect.any(Array)
      });
    });
  });

  describe('GET /calendar - Retrieve Events', () => {
    it('should retrieve calendar events', async () => {
      // Arrange
      mockRequest.method = 'GET';
      mockRequest.query = { maxResults: '10' };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should handle query parameters correctly', async () => {
      // Arrange
      mockRequest.method = 'GET';
      mockRequest.query = {
        timeMin: '2024-01-01T00:00:00Z',
        timeMax: '2024-01-31T23:59:59Z',
        maxResults: '20'
      };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('PUT /calendar/:id - Update Event', () => {
    it('should update calendar event', async () => {
      // Arrange
      mockRequest.method = 'PUT';
      mockRequest.params = { id: 'test-event-id' };
      mockRequest.body = {
        title: 'Updated Meeting',
        description: 'Updated description',
        start: '2024-01-16T14:00:00+09:00',
        end: '2024-01-16T15:00:00+09:00'
      };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Calendar event updated successfully'
        })
      );
    });

    it('should handle missing event ID', async () => {
      // Arrange
      mockRequest.method = 'PUT';
      mockRequest.params = {};
      mockRequest.body = { title: 'Updated Meeting' };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Event ID is required',
        code: 'MISSING_EVENT_ID'
      });
    });

    it('should handle invalid update data', async () => {
      // Arrange
      mockRequest.method = 'PUT';
      mockRequest.params = { id: 'test-event-id' };
      mockRequest.body = { invalidField: 'invalid' };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid update data',
        code: 'INVALID_UPDATE_DATA',
        details: expect.any(Array)
      });
    });
  });

  describe('DELETE /calendar/:id - Delete Event', () => {
    it('should delete calendar event', async () => {
      // Arrange
      mockRequest.method = 'DELETE';
      mockRequest.params = { id: 'test-event-id' };

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Calendar event deleted successfully'
        })
      );
    });

    it('should handle missing event ID', async () => {
      // Arrange
      mockRequest.method = 'DELETE';
      mockRequest.params = {};

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Event ID is required',
        code: 'MISSING_EVENT_ID'
      });
    });
  });

  describe('Method not allowed', () => {
    it('should handle unsupported HTTP methods', async () => {
      // Arrange
      mockRequest.method = 'PATCH';

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(405);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        message: 'PATCH is not supported for this endpoint'
      });
    });
  });

  describe('Error handling', () => {
    it('should handle internal server errors', async () => {
      // Arrange
      mockRequest.method = 'POST';
      mockRequest.body = { text: 'Schedule a meeting' };
      
      // Mock an error in the NaturalLanguageHandler
      const { NaturalLanguageHandler } = require('../../src/api/calendar/NaturalLanguageHandler');
      NaturalLanguageHandler.mockImplementation(() => ({
        handleRequest: jest.fn().mockRejectedValue(new Error('Internal error'))
      }));

      // Act
      await calendar(mockRequest, mockResponse);
      await waitForAsync();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create calendar event',
        message: 'Internal error'
      });
    });
  });
});
