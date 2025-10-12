// Import types from @api-types package
import { CalendarEvent } from '@ai-assistant/api-types';
import OpenAI from 'openai';

/** AI Model Configuration */
export interface AIModelOptions {
  model: string; // ex: "gpt-4o-mini"
  temperature?: number;
}

/** AI Output Generic Format */
export interface AIResponse<T> {
  data: T;
  rawText: string;
}

/** AI Input Common Structure */
export interface AIRequest<T> {
  instruction: string; // Prompt instruction text
  input: string;       // Natural language input from user
  schemaExample: T;    // Sample JSON for desired output
  options: AIModelOptions;
}

/**
 * GPTService
 * GPT API integration for natural language to structured data conversion
 */
export class GPTService {
  private openai: OpenAI;

  constructor() {
    // Only initialize OpenAI client if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn('OPENAI_API_KEY not found, GPTService will use mock responses');
      this.openai = null as any; // Type assertion for testing
    }
  }

  /**
   * Parse natural language input to structured CalendarEvent using GPT API
   * @param input - Natural language input from user
   * @returns Promise<CalendarEvent> - Structured event data
   */
  async parseToEvent(input: string): Promise<CalendarEvent> {
    console.log('🤖 GPT Service called with input:11111111111111111111111111111', input);
    try {
      // Check if API key is available
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY not found, falling back to mock response');
        // return await this.mockGPTResponse(input);
        throw new Error('OPENAI_API_KEY not found');
      }

      const prompt = this.buildPromptTemplate().replace('{input}', input);
      const response = await this.callGPTAPI(prompt);
      return response;
    } catch (error) {
      console.error('GPTService parsing error:', error);
      // Fallback to mock response on error
      return await this.mockGPTResponse(input);
    }
  }

  /**
   * Build the prompt template for GPT API
   * @returns string - Formatted prompt template
   */
  private buildPromptTemplate(): string {
    return `
You are a calendar assistant that converts natural language requests into structured calendar events.

Examples:
Input: "Schedule a meeting with John tomorrow at 2 PM for 1 hour"
Output: {
  "summary": "Meeting with John",
  "description": "Meeting with John",
  "start": {
    "dateTime": "2024-01-15T14:00:00",
    "timeZone": "UTC"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00",
    "timeZone": "UTC"
  },
  "attendees": ["john@example.com"]
}

Input: "Create a reminder for dentist appointment next Friday at 10 AM"
Output: {
  "summary": "Dentist appointment",
  "description": "Dentist appointment reminder",
  "start": {
    "dateTime": "2024-01-19T10:00:00",
    "timeZone": "UTC"
  },
  "end": {
    "dateTime": "2024-01-19T11:00:00",
    "timeZone": "UTC"
  },
  "attendees": []
}

Please convert the following natural language input to a calendar event JSON:
Input: "{input}"

Respond with valid JSON only, following the Google Calendar API event structure.
    `.trim();
  }

  /**
   * Mock GPT response for development/testing
   * @param input - Natural language input
   * @returns Promise<CalendarEvent> - Mock structured event data
   */
  private async mockGPTResponse(input: string): Promise<CalendarEvent> {
    // Mock implementation - replace with actual GPT API call
    return {
      kind: 'calendar#event',
      etag: `"${Date.now()}"`,
      id: `mock_${Date.now()}`,
      summary: `Event from: ${input}`,
      description: `Generated from: ${input}`,
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
        timeZone: 'UTC'
      },
      attendees: [],
      status: 'confirmed',
      visibility: 'default',
      transparency: 'opaque'
    };
  }

  /**
   * Call actual GPT API
   * @param prompt - Formatted prompt for GPT
   * @returns Promise<CalendarEvent> - GPT response parsed as CalendarEvent
   */
  private async callGPTAPI(prompt: string): Promise<CalendarEvent> {
    try {
      // Check if OpenAI client is available
      if (!this.openai) {
        throw new Error('OpenAI client not initialized - no API key provided');
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 1, // Default temperature for creative output
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      const parsedResponse = JSON.parse(content);
      
      // Validate that the response has the expected structure
      if (!parsedResponse.summary || !parsedResponse.start || !parsedResponse.end) {
        throw new Error('Invalid response structure from OpenAI');
      }

      return parsedResponse as CalendarEvent;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }
}
