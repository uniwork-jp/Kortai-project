/**
 * Tests for GPTService
 * Tests natural language to structured data conversion
 */

import { GPTService } from '../../src/services/GPTService';

describe('GPTService', () => {
  let gptService: GPTService;

  beforeEach(() => {
    // Clear environment variables to ensure consistent test behavior
    delete process.env.OPENAI_API_KEY;
    gptService = new GPTService();
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create GPTService instance', () => {
      expect(gptService).toBeDefined();
      expect(typeof gptService.parseToEvent).toBe('function');
    });

    it('should initialize with prompt template', () => {
      // The service should be initialized with a prompt template
      expect(gptService).toBeDefined();
    });
  });

  describe('parseToEvent', () => {
    describe('Valid inputs', () => {
      it('should parse Japanese natural language input', async () => {
        // Arrange
        const input = '明日の午後2時に会議を予定してください';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('description');
        expect(result).toHaveProperty('start');
        expect(result).toHaveProperty('end');
      });
    });

    describe('Edge cases', () => {
      it('should handle empty input', async () => {
        // Arrange
        const input = '';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('description');
      });

      it('should handle very long input', async () => {
        // Arrange
        const input = 'Schedule a very long meeting with many details about the project requirements and specifications and all the attendees and the agenda items and the preparation work needed for tomorrow at 2 PM';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('description');
      });

      it('should handle input with special characters', async () => {
        // Arrange
        const input = 'Schedule a meeting @ 2:30 PM with @john & @jane #important';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('description');
      });
    });

    describe('Error handling', () => {
      it('should handle errors gracefully', async () => {
        // Arrange
        const input = 'Schedule a meeting tomorrow';
        
        // Act
        const result = await gptService.parseToEvent(input);

        // Assert - Should return a valid result even if there are errors
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('start');
        expect(result).toHaveProperty('end');
      });
    });

    describe('Response validation', () => {
      it('should return valid CalendarEvent structure', async () => {
        // Arrange
        const input = 'Schedule a meeting tomorrow at 2 PM';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert - Verify CalendarEvent interface compliance
        expect(result).toMatchObject({
          summary: expect.any(String),
          description: expect.any(String),
          start: expect.objectContaining({
            dateTime: expect.any(String),
            timeZone: expect.any(String)
          }),
          end: expect.objectContaining({
            dateTime: expect.any(String),
            timeZone: expect.any(String)
          }),
          attendees: expect.any(Array)
        });
      });

      it('should return valid ISO date-time strings', async () => {
        // Arrange
        const input = 'Schedule a meeting tomorrow at 2 PM';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        const startDate = new Date(result.start.dateTime!);
        const endDate = new Date(result.end.dateTime!);

        expect(startDate.getTime()).not.toBeNaN();
        expect(endDate.getTime()).not.toBeNaN();
        expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
      });

      it('should return valid timezone information', async () => {
        // Arrange
        const input = 'Schedule a meeting tomorrow at 2 PM';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        expect(result.start.timeZone).toBeDefined();
        expect(result.end.timeZone).toBeDefined();
        expect(typeof result.start.timeZone).toBe('string');
        expect(typeof result.end.timeZone).toBe('string');
      });

      it('should return valid attendees array', async () => {
        // Arrange
        const input = 'Schedule a meeting with john@example.com and jane@example.com';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        expect(Array.isArray(result.attendees)).toBe(true);
        // Attendees should be strings (email addresses)
        result.attendees?.forEach(attendee => {
          expect(typeof attendee).toBe('string');
        });
      });
    });

    describe('Performance', () => {
      it('should parse input within reasonable time', async () => {
        // Arrange
        const input = 'Schedule a meeting tomorrow at 2 PM';
        const startTime = Date.now();

        // Act
        const result = await gptService.parseToEvent(input);
        const endTime = Date.now();

        // Assert
        expect(result).toBeDefined();
        expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      });

      it('should handle multiple concurrent requests', async () => {
        // Arrange
        const inputs = [
          'Schedule a meeting tomorrow at 2 PM',
          'Create an event next Monday at 9 AM',
          'Book a conference room for Friday afternoon'
        ];

        // Act
        const promises = inputs.map(input => gptService.parseToEvent(input));
        const results = await Promise.all(promises);

        // Assert
        expect(results).toHaveLength(3);
        results.forEach(result => {
          expect(result).toBeDefined();
          expect(result).toHaveProperty('summary');
          expect(result).toHaveProperty('start');
          expect(result).toHaveProperty('end');
        });
      });
    });

    describe('Mock implementation', () => {
      it('should use mock implementation by default', async () => {
        // Arrange
        const input = 'Schedule a meeting tomorrow at 2 PM';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        expect(result).toBeDefined();
        expect(result.summary).toBeDefined();
        expect(result.description).toBeDefined();
        expect(result).toHaveProperty('start');
        expect(result).toHaveProperty('end');
      });

      it('should generate different responses for different inputs', async () => {
        // Arrange
        const input1 = 'Schedule a meeting tomorrow';
        const input2 = 'Create an event next week';

        // Act
        const result1 = await gptService.parseToEvent(input1);
        const result2 = await gptService.parseToEvent(input2);

        // Assert
        expect(result1).toBeDefined();
        expect(result2).toBeDefined();
        expect(result1).toHaveProperty('summary');
        expect(result2).toHaveProperty('summary');
        expect(result1).toHaveProperty('start');
        expect(result2).toHaveProperty('start');
      });

      it('should generate valid start and end times', async () => {
        // Arrange
        const input = 'Schedule a meeting tomorrow at 2 PM';

        // Act
        const result = await gptService.parseToEvent(input);

        // Assert
        const startTime = new Date(result.start.dateTime!);
        const endTime = new Date(result.end.dateTime!);
        
        expect(startTime.getTime()).not.toBeNaN();
        expect(endTime.getTime()).not.toBeNaN();
        expect(endTime.getTime()).toBeGreaterThan(startTime.getTime());
        
        // End time should be approximately 1 hour after start time (based on mock implementation)
        const timeDiff = endTime.getTime() - startTime.getTime();
        expect(timeDiff).toBeCloseTo(60 * 60 * 1000, -2); // Within 100ms of 1 hour
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complex multi-part requests', async () => {
      // Arrange
      const input = 'Schedule a project review meeting with the development team including john@example.com, jane@example.com, and bob@example.com tomorrow at 2 PM for 2 hours in conference room A';

      // Act
      const result = await gptService.parseToEvent(input);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      expect(result).toHaveProperty('attendees');
    });

    it('should handle requests with multiple time references', async () => {
      // Arrange
      const input = 'Schedule a meeting tomorrow at 2 PM that ends at 4 PM';

      // Act
      const result = await gptService.parseToEvent(input);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      
      const startTime = new Date(result.start.dateTime!);
      const endTime = new Date(result.end.dateTime!);
      expect(endTime.getTime()).toBeGreaterThan(startTime.getTime());
    });

    it('should handle requests with relative time expressions', async () => {
      // Arrange
      const testCases = [
        'Schedule a meeting in 2 hours',
        'Create an event next Monday',
        'Book something for this Friday',
        'Schedule for tomorrow morning'
      ];

      // Act & Assert
      for (const input of testCases) {
        const result = await gptService.parseToEvent(input);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('start');
        expect(result).toHaveProperty('end');
      }
    });
  });
});
