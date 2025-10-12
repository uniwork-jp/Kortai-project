#!/usr/bin/env ts-node

/**
 * Local Test Execution File for NaturalLanguageHandler (TypeScript)
 * Tests only scenarios with natural Japanese input - one scenario per test
 */

// Set environment variable to avoid OpenAI API key requirement
process.env.OPENAI_API_KEY = 'test-key-for-local-testing';

// Import the service under test
import { NaturalLanguageHandler } from './src/api/calendar/NaturalLanguageHandler';
import { CalendarEvent } from '@ai-assistant/api-types';



const Input = {
  name: 'Japanese Meeting Request',
  input: '明後日１５時から１半時間MTG入れてほしい',
  userId: 'test-user-1'
};



// Mock implementations for local testing
class MockGPTService {
  async parseToEvent(input: string): Promise<CalendarEvent> {
    console.log('🤖 GPT Service called with input:', input);
    
    // Simulate Japanese instruction processing
    if (input.includes('次の自然言語文からGoogleカレンダー用のイベント情報を抽出してください')) {
      console.log('📝 Processing with Japanese instruction...');
    }
    
    // Return mock event data based on input
    const now = Date.now();
    const result = {
      kind: 'calendar#event',
      etag: `"${now}"`,
      id: `local_test_${now}`,
      summary: this.extractSummaryFromInput(input),
      description: this.extractDescriptionFromInput(input),
      start: {
        dateTime: '2024-01-15T14:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: '2024-01-15T15:00:00+09:00',
        timeZone: 'Asia/Tokyo'
      },
      attendees: this.extractAttendeesFromInput(input),
      colorId: '1'
    };
    
    // Console log GPT result
    console.log('🎯 GPT Result:', JSON.stringify(result, null, 2));
    
    return result;
  }

  private extractSummaryFromInput(input: string): string {
    if (input.includes('会議')) return '会議';
    if (input.includes('予約')) return '予約';
    if (input.includes('ミーティング')) return 'ミーティング';
    if (input.includes('アポイント')) return 'アポイント';
    return 'イベント';
  }

  private extractDescriptionFromInput(input: string): string {
    return `自然言語から生成: ${input}`;
  }

  private extractAttendeesFromInput(input: string): any[] {
    const attendees: any[] = [];
    if (input.includes('ジョン')) attendees.push({ email: 'john@example.com', displayName: 'ジョン' });
    if (input.includes('田中')) attendees.push({ email: 'tanaka@example.com', displayName: '田中さん' });
    if (input.includes('佐藤')) attendees.push({ email: 'sato@example.com', displayName: '佐藤さん' });
    return attendees;
  }
}

class MockEventValidator {
  async validate(event: CalendarEvent): Promise<CalendarEvent> {
    console.log('✅ Event validation passed');
    return event;
  }
  
  async normalizeDates(event: CalendarEvent): Promise<CalendarEvent> {
    console.log('📅 Date normalization completed');
    return event;
  }
}

class MockCalendarService {
  async createEvent(userId: string, event: CalendarEvent): Promise<string> {
    console.log('📅 Calendar event created for user:', userId);
    console.log('📋 Event details:', {
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      attendees: event.attendees
    });
    return 'mock-event-id';
  }
}



// Single test function using Input
async function testJapaneseMeetingRequest(): Promise<void> {
  console.log(`\n📋 Test: ${Input.name}`);
  console.log(`📝 Input: "${Input.input}"`);
  console.log(`👤 User ID: ${Input.userId}`);
  console.log('-'.repeat(50));
  
  try {
    // Create handler instance
    const handler = new NaturalLanguageHandler();
    
    // Replace dependencies with mocks
    (handler as any).gptService = new MockGPTService();
    (handler as any).eventValidator = new MockEventValidator();
    (handler as any).calendarService = new MockCalendarService();
    
    // Test create request
    const result = await handler.handleRequest(Input.input, Input.userId);
    console.log('✅ Create request completed successfully');
    console.log('🎯 GPT Result:', JSON.stringify(result, null, 2));
    
    console.log('📊 Final Result:', {
      kind: result.kind,
      summary: result.summary,
      description: result.description,
      start: result.start,
      end: result.end,
      attendees: result.attendees
    });
    
  } catch (error) {
    console.error('❌ Test failed:', (error as Error).message);
  }
  
  console.log('-'.repeat(50));
}

// Main execution
async function main(): Promise<void> {
  console.log('🧪 NaturalLanguageHandler Local Test Runner');
  console.log('📅 Testing Japanese input with GPT-5 nano configuration\n');
  
  await testJapaneseMeetingRequest();
  
  console.log('\n✨ Japanese scenario test completed successfully!');
  console.log('💡 To run the full test suite, use: pnpm test');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🧪 NaturalLanguageHandler Local Test Runner (Japanese Scenarios)

Usage: ts-node test-local.ts [options]

Options:
  --help, -h     Show this help message

Examples:
  ts-node test-local.ts              # Run all Japanese scenario tests
  pnpm run test:local               # Run all Japanese scenario tests
`);
  process.exit(0);
}

main();