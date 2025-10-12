// Import types from @api-types package
import { CalendarEvent } from '@ai-assistant/api-types';

// Import services
import { GPTService } from '../../services/GPTService';
import { EventValidator } from './EventValidator';
import { CalendarService } from './CalendarService';

/**
 * NaturalLanguageHandler
 * Cloud Functions entry point for processing natural language calendar requests
 * Uses GPT-5 nano with temperature 1 for creative natural language processing
 */
export class NaturalLanguageHandler {
  private gptService: GPTService;
  private eventValidator: EventValidator;
  private calendarService: CalendarService;

  constructor() {
    this.gptService = new GPTService();
    this.eventValidator = new EventValidator();
    this.calendarService = new CalendarService();
  }

  /**
   * Main entry point for handling natural language calendar requests
   * Uses Japanese instruction: "次の自然言語文からGoogleカレンダー用のイベント情報を抽出してください。"
   * @param input - Natural language input from user
   * @param userId - Firebase user ID
   * @returns Promise<CalendarEvent> - Structured event data
   */
  async handleRequest(input: string, userId: string): Promise<CalendarEvent> {
    try {
      // Step 1: Parse natural language to structured event data using GPT-5 nano with temp 1
      const rawEventData = await this.parseWithJapaneseInstruction(input);
      
      // Step 2: Validate and normalize the event data using Zod schema
      const validatedEvent = await this.eventValidator.validate(rawEventData);
      const normalizedEvent = await this.eventValidator.normalizeDates(validatedEvent);
      
      // Step 3: Create/update/delete calendar event based on operation
      await this.calendarService.createEvent(userId, normalizedEvent);
      
      return normalizedEvent;
    } catch (error) {
      throw new Error(`NaturalLanguageHandler error: ${error}`);
    }
  }

  /**
   * Handle calendar event updates
   * @param eventId - Google Calendar event ID
   * @param input - Natural language input for updates
   * @param userId - Firebase user ID
   * @returns Promise<CalendarEvent> - Updated event data
   */
  async handleUpdateRequest(eventId: string, input: string, userId: string): Promise<CalendarEvent> {
    try {
      const rawEventData = await this.parseWithJapaneseInstruction(input);
      const validatedEvent = await this.eventValidator.validate(rawEventData);
      const normalizedEvent = await this.eventValidator.normalizeDates(validatedEvent);
      
      await this.calendarService.updateEvent(userId, eventId, normalizedEvent);
      
      return normalizedEvent;
    } catch (error) {
      throw new Error(`NaturalLanguageHandler update error: ${error}`);
    }
  }

  /**
   * Parse natural language input using Japanese instruction and GPT-5 nano with temperature 1
   * @param input - Natural language input
   * @returns Promise<CalendarEvent> - Parsed event data
   */
  private async parseWithJapaneseInstruction(input: string): Promise<CalendarEvent> {
    const prompt = `
次の自然言語文からGoogleカレンダー用のイベント情報を抽出してください。

例:
入力: "明日の午後2時にジョンとの会議を1時間スケジュール"
出力: {
  "kind": "calendar#event",
  "etag": "\\"${Date.now()}\\"",
  "id": "event_${Date.now()}",
  "summary": "ジョンとの会議",
  "description": "ジョンとの会議",
  "location": "",
  "timeZone": "Asia/Tokyo",
  "start": {
    "dateTime": "2024-01-15T14:00:00+09:00",
    "timeZone": "Asia/Tokyo"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00+09:00",
    "timeZone": "Asia/Tokyo"
  },
  "attendees": ["john@example.com"],
  "colorId": "1",
  "backgroundColor": "#a4bdfc",
  "foregroundColor": "#1d1d1d",
  "hidden": false,
  "selected": true,
  "accessRole": "writer"
}

以下の自然言語入力をGoogleカレンダーイベントJSONに変換してください:
入力: "${input}"

有効なJSONのみで応答し、GoogleカレンダーAPIイベント構造に従ってください。
    `.trim();

    // Use GPT-5 nano with temperature 1 for creative processing
    return await this.callGPTWithConfig(prompt, {
      model: "gpt-5-nano",
      temperature: 1
    });
  }

  /**
   * Call GPT API with specific configuration
   * @param prompt - Formatted prompt
   * @param options - AI model options
   * @returns Promise<CalendarEvent> - Parsed response
   */
  private async callGPTWithConfig(prompt: string, options: { model: string; temperature: number }): Promise<CalendarEvent> {
    // This would integrate with OpenAI API using the specified config
    // For now, fallback to existing GPTService with enhanced prompt
    return await this.gptService.parseToEvent(prompt);
  }

  /**
   * Handle calendar event deletion
   * @param eventId - Google Calendar event ID
   * @param userId - Firebase user ID
   * @returns Promise<void>
   */
  async handleDeleteRequest(eventId: string, userId: string): Promise<void> {
    try {
      await this.calendarService.deleteEvent(userId, eventId);
    } catch (error) {
      throw new Error(`NaturalLanguageHandler delete error: ${error}`);
    }
  }
}
