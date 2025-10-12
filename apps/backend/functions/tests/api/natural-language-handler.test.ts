/**
 * Tests for NaturalLanguageHandler service
 * Tests the core natural language processing flow with Japanese instructions and GPT-5 nano
 */

// Jest globals are available without import

// Import the service under test
import { NaturalLanguageHandler } from '../../src/api/calendar/NaturalLanguageHandler';
import { GPTService } from '../../src/services/GPTService';
import { EventValidator } from '../../src/api/calendar/EventValidator';
import { CalendarService } from '../../src/api/calendar/CalendarService';
import { CalendarEvent } from '@ai-assistant/api-types';

// Mock the dependencies
jest.mock('../../src/services/GPTService');
jest.mock('../../src/api/calendar/EventValidator');
jest.mock('../../src/api/calendar/CalendarService');

// Clear the global mock for NaturalLanguageHandler to test the real implementation
jest.unmock('../../src/api/calendar/NaturalLanguageHandler');

describe('NaturalLanguageHandler', () => {
  let handler: NaturalLanguageHandler;
  let mockGPTService: jest.Mocked<GPTService>;
  let mockEventValidator: jest.Mocked<EventValidator>;
  let mockCalendarService: jest.Mocked<CalendarService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mocked instances
    mockGPTService = new GPTService() as jest.Mocked<GPTService>;
    mockEventValidator = new EventValidator() as jest.Mocked<EventValidator>;
    mockCalendarService = new CalendarService() as jest.Mocked<CalendarService>;
    
    // Create a new instance with mocked dependencies
    handler = new NaturalLanguageHandler();
    
    // Replace the private properties with mocks
    (handler as any).gptService = mockGPTService;
    (handler as any).eventValidator = mockEventValidator;
    (handler as any).calendarService = mockCalendarService;
  });

  describe('handleRequest', () => {
    const mockCalendarEvent: CalendarEvent = {
      kind: 'calendar#event',
      etag: '"1234567890"',
      id: 'test-event-id',
      summary: 'テスト会議',
      description: 'テスト会議の説明',
      start: {
        dateTime: '2024-01-15T14:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: '2024-01-15T15:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      attendees: [],
      colorId: '1'
    };

    beforeEach(() => {
      // Setup default mock implementations
      mockGPTService.parseToEvent.mockResolvedValue(mockCalendarEvent);
      mockEventValidator.validate.mockResolvedValue(mockCalendarEvent);
      mockEventValidator.normalizeDates.mockResolvedValue(mockCalendarEvent);
      mockCalendarService.createEvent.mockResolvedValue('mock-event-id');
    });

    it('should process Japanese natural language input successfully', async () => {
      // Arrange
      const japaneseInput = '明日の午後2時にジョンとの会議を1時間スケジュール';
      const userId = 'test-user-id';

      // Act
      const result = await handler.handleRequest(japaneseInput, userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('kind', 'calendar#event');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      
      // Verify the flow - the handler calls parseWithJapaneseInstruction which calls GPTService
      expect(mockGPTService.parseToEvent).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.validate).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.normalizeDates).toHaveBeenCalledTimes(1);
      expect(mockCalendarService.createEvent).toHaveBeenCalledWith(userId, mockCalendarEvent);
    });

    it('should handle GPT service errors gracefully', async () => {
      // Arrange
      const input = 'テスト入力';
      const userId = 'test-user-id';
      const gptError = new Error('GPT API error');
      mockGPTService.parseToEvent.mockRejectedValue(gptError);

      // Act & Assert
      await expect(handler.handleRequest(input, userId)).rejects.toThrow('NaturalLanguageHandler error: Error: GPT API error');
      
      // Verify that GPT service was called but subsequent steps failed
      expect(mockGPTService.parseToEvent).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.validate).not.toHaveBeenCalled();
      expect(mockEventValidator.normalizeDates).not.toHaveBeenCalled();
      expect(mockCalendarService.createEvent).not.toHaveBeenCalled();
    });

    it('should handle validation errors gracefully', async () => {
      // Arrange
      const input = 'テスト入力';
      const userId = 'test-user-id';
      const validationError = new Error('Validation failed');
      mockEventValidator.validate.mockRejectedValue(validationError);

      // Act & Assert
      await expect(handler.handleRequest(input, userId)).rejects.toThrow('NaturalLanguageHandler error: Error: Validation failed');
      
      // Verify that GPT service was called but subsequent steps failed
      expect(mockGPTService.parseToEvent).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.validate).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.normalizeDates).not.toHaveBeenCalled();
      expect(mockCalendarService.createEvent).not.toHaveBeenCalled();
    });

    it('should handle calendar service errors gracefully', async () => {
      // Arrange
      const input = 'テスト入力';
      const userId = 'test-user-id';
      const calendarError = new Error('Calendar API error');
      mockCalendarService.createEvent.mockRejectedValue(calendarError);

      // Act & Assert
      await expect(handler.handleRequest(input, userId)).rejects.toThrow('NaturalLanguageHandler error: Error: Calendar API error');
      
      // Verify the full flow was attempted
      expect(mockGPTService.parseToEvent).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.validate).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.normalizeDates).toHaveBeenCalledTimes(1);
      expect(mockCalendarService.createEvent).toHaveBeenCalledWith(userId, mockCalendarEvent);
    });
  });

  describe('handleUpdateRequest', () => {
    const mockCalendarEvent: CalendarEvent = {
      kind: 'calendar#event',
      etag: '"1234567890"',
      id: 'test-event-id',
      summary: '更新された会議',
      description: '更新された会議の説明',
      start: {
        dateTime: '2024-01-16T15:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: '2024-01-16T16:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      attendees: [{
        email: 'john@example.com',
        displayName: 'John Doe'
      }],
      colorId: '2'
    };

    beforeEach(() => {
      mockGPTService.parseToEvent.mockResolvedValue(mockCalendarEvent);
      mockEventValidator.validate.mockResolvedValue(mockCalendarEvent);
      mockEventValidator.normalizeDates.mockResolvedValue(mockCalendarEvent);
      mockCalendarService.updateEvent.mockResolvedValue('updated-event-id');
    });

    it('should update calendar event successfully', async () => {
      // Arrange
      const eventId = 'existing-event-id';
      const input = '会議の時間を午後3時に変更';
      const userId = 'test-user-id';

      // Act
      const result = await handler.handleUpdateRequest(eventId, input, userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('kind', 'calendar#event');
      expect(result).toHaveProperty('summary', '更新された会議');
      
      // Verify the flow
      expect(mockGPTService.parseToEvent).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.validate).toHaveBeenCalledTimes(1);
      expect(mockEventValidator.normalizeDates).toHaveBeenCalledTimes(1);
      expect(mockCalendarService.updateEvent).toHaveBeenCalledWith(userId, eventId, mockCalendarEvent);
    });

    it('should handle update errors gracefully', async () => {
      // Arrange
      const eventId = 'existing-event-id';
      const input = 'テスト更新';
      const userId = 'test-user-id';
      const updateError = new Error('Update failed');
      mockCalendarService.updateEvent.mockRejectedValue(updateError);

      // Act & Assert
      await expect(handler.handleUpdateRequest(eventId, input, userId)).rejects.toThrow('NaturalLanguageHandler update error: Error: Update failed');
    });
  });

  describe('handleDeleteRequest', () => {
    beforeEach(() => {
      mockCalendarService.deleteEvent.mockResolvedValue(undefined);
    });

    it('should delete calendar event successfully', async () => {
      // Arrange
      const eventId = 'event-to-delete';
      const userId = 'test-user-id';

      // Act
      await handler.handleDeleteRequest(eventId, userId);

      // Assert
      expect(mockCalendarService.deleteEvent).toHaveBeenCalledWith(userId, eventId);
    });

    it('should handle delete errors gracefully', async () => {
      // Arrange
      const eventId = 'event-to-delete';
      const userId = 'test-user-id';
      const deleteError = new Error('Delete failed');
      mockCalendarService.deleteEvent.mockRejectedValue(deleteError);

      // Act & Assert
      await expect(handler.handleDeleteRequest(eventId, userId)).rejects.toThrow('NaturalLanguageHandler delete error: Error: Delete failed');
    });
  });

  describe('GoogleCalendarEvent structure validation', () => {
    it('should return properly structured GoogleCalendarEvent', async () => {
      // Arrange
      const input = 'テストイベント';
      const userId = 'test-user-id';
      const mockEvent: CalendarEvent = {
        kind: 'calendar#event',
        etag: '"1234567890"',
        id: 'test-event-id',
        summary: 'テストイベント',
        description: 'テストイベントの説明',
        location: '会議室A',
        colorId: '1',
        start: {
          dateTime: '2024-01-15T14:00:00+09:00',
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: '2024-01-15T15:00:00+09:00',
          timeZone: 'Asia/Tokyo'
        },
        attendees: [{
          email: 'john@example.com',
          displayName: 'John Doe'
        }],
        reminders: {
          useDefault: true,
          overrides: [
            {
              method: 'popup',
              minutes: 10
            }
          ]
        }
      };

      mockGPTService.parseToEvent.mockResolvedValue(mockEvent);
      mockEventValidator.validate.mockResolvedValue(mockEvent);
      mockEventValidator.normalizeDates.mockResolvedValue(mockEvent);
      mockCalendarService.createEvent.mockResolvedValue('mock-event-id');

      // Act
      const result = await handler.handleRequest(input, userId);

      // Assert
      expect(result).toHaveProperty('kind', 'calendar#event');
      expect(result).toHaveProperty('etag');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('colorId');
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      expect(result).toHaveProperty('attendees');
      expect(result).toHaveProperty('reminders');
    });
  });
});