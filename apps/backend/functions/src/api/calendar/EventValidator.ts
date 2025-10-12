// Import types from @api-types package
import { CalendarEvent } from '@ai-assistant/api-types';

/**
 * EventValidator
 * Data validation and normalization using Zod/JSON Schema
 */
export class EventValidator {
  /**
   * Validate event data using Zod/JSON Schema
   * @param event - Event data to validate
   * @returns Promise<CalendarEvent> - Validated event data
   */
  async validate(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      // Basic validation checks
      this.validateRequiredFields(event);
      this.validateDateTimeFormat(event);
      this.validateAttendees(event);
      
      return event;
    } catch (error) {
      throw new Error(`Event validation failed: ${error}`);
    }
  }

  /**
   * Normalize dates in event data
   * @param event - Event data with potentially relative dates
   * @returns Promise<CalendarEvent> - Event with normalized dates
   */
  async normalizeDates(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const normalizedEvent = { ...event };
      
      // Normalize start date
      if (normalizedEvent.start?.dateTime) {
        normalizedEvent.start.dateTime = this.normalizeDateTime(normalizedEvent.start.dateTime);
      }
      
      // Normalize end date
      if (normalizedEvent.end?.dateTime) {
        normalizedEvent.end.dateTime = this.normalizeDateTime(normalizedEvent.end.dateTime);
      }
      
      return normalizedEvent;
    } catch (error) {
      throw new Error(`Date normalization failed: ${error}`);
    }
  }

  /**
   * Validate required fields are present
   * @param event - Event data to validate
   */
  private validateRequiredFields(event: CalendarEvent): void {
    if (!event.summary || event.summary.trim() === '') {
      throw new Error('Event summary is required');
    }
    
    if (!event.start) {
      throw new Error('Event start time is required');
    }
    
    if (!event.end) {
      throw new Error('Event end time is required');
    }
    
    if (!event.start.dateTime && !event.start.date) {
      throw new Error('Event start must have either dateTime or date');
    }
    
    if (!event.end.dateTime && !event.end.date) {
      throw new Error('Event end must have either dateTime or date');
    }
  }

  /**
   * Validate date/time format
   * @param event - Event data to validate
   */
  private validateDateTimeFormat(event: CalendarEvent): void {
    if (event.start?.dateTime) {
      this.validateISODateTime(event.start.dateTime);
    }
    
    if (event.end?.dateTime) {
      this.validateISODateTime(event.end.dateTime);
    }
    
    if (event.start?.date) {
      this.validateISODate(event.start.date);
    }
    
    if (event.end?.date) {
      this.validateISODate(event.end.date);
    }
  }

  /**
   * Validate attendees array
   * @param event - Event data to validate
   */
  private validateAttendees(event: CalendarEvent): void {
    if (event.attendees && Array.isArray(event.attendees)) {
      for (const attendee of event.attendees) {
        if (typeof attendee === 'string') {
          this.validateEmail(attendee);
        } else if (typeof attendee === 'object' && attendee.email) {
          this.validateEmail(attendee.email);
        }
      }
    }
  }

  /**
   * Validate ISO date-time format
   * @param dateTime - Date-time string to validate
   */
  private validateISODateTime(dateTime: string): void {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date-time format: ${dateTime}`);
    }
  }

  /**
   * Validate ISO date format
   * @param date - Date string to validate
   */
  private validateISODate(date: string): void {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
    }
  }

  /**
   * Validate email format
   * @param email - Email string to validate
   */
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
  }

  /**
   * Normalize date-time string to ISO format
   * @param dateTime - Date-time string to normalize
   * @returns string - Normalized ISO date-time string
   */
  private normalizeDateTime(dateTime: string): string {
    // Handle relative date expressions
    const normalized = this.parseRelativeDate(dateTime);
    
    // Convert to ISO string
    const date = new Date(normalized);
    if (isNaN(date.getTime())) {
      throw new Error(`Cannot normalize date-time: ${dateTime}`);
    }
    
    return date.toISOString();
  }

  /**
   * Parse relative date expressions
   * @param dateTime - Date-time string that may contain relative expressions
   * @returns string - Absolute date-time string
   */
  private parseRelativeDate(dateTime: string): string {
    const now = new Date();
    const lowerCaseInput = dateTime.toLowerCase();
    
    // Handle common relative expressions
    if (lowerCaseInput.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    }
    
    if (lowerCaseInput.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString();
    }
    
    if (lowerCaseInput.includes('next month')) {
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth.toISOString();
    }
    
    // If no relative expressions found, return as-is
    return dateTime;
  }
}
