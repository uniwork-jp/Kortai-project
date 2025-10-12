import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';

// Import types from @api-types package
import {
  SuccessResponse,
  ErrorResponse
} from '@ai-assistant/api-types';

// Import Zod schemas for validation
import {
  NaturalLanguageInputSchema,
  CalendarEventSchema,
  EventUpdateInputSchema,
  SuccessResponseSchema
} from '@ai-assistant/api-types';

// Import calendar services
import { NaturalLanguageHandler } from './NaturalLanguageHandler';
import { CalendarService } from './CalendarService';

/**
 * Calendar API Endpoint
 * Handles calendar-related operations following the class diagram flow
 */
export const calendar = onRequest(
  { cors: true },
  async (request, response) => {
    logger.info('Calendar API endpoint called', {
      method: request.method,
      path: request.path,
      headers: request.headers,
    });

    try {
      switch (request.method) {
        case 'GET':
          await handleGetCalendar(request, response);
          break;
        case 'POST':
          await handleCreateCalendarEvent(request, response);
          break;
        case 'PUT':
          await handleUpdateCalendarEvent(request, response);
          break;
        case 'DELETE':
          await handleDeleteCalendarEvent(request, response);
          break;
        default:
          response.status(405).json({
            error: 'Method not allowed',
            message: `${request.method} is not supported for this endpoint`,
          } as ErrorResponse);
      }
    } catch (error) {
      logger.error('Calendar API error:', error);
      response.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      } as ErrorResponse);
    }
  }
);

/**
 * Handle GET requests for calendar data
 * Flow: Get events from Google Calendar
 */
async function handleGetCalendar(request: any, response: any) {
  try {
    const userId = request.headers['user-id'] || 'default-user'; // TODO: Get from auth
    const calendarService = new CalendarService();
    
    // Get query parameters
    const { timeMin, timeMax, maxResults = 10 } = request.query;
    
    const events = await calendarService.getEvents(userId, {
      timeMin: timeMin as string,
      timeMax: timeMax as string,
      maxResults: parseInt(maxResults as string),
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    // Validate response using Zod schema
    const eventsValidation = CalendarEventSchema.array().safeParse(events);
    if (!eventsValidation.success) {
      console.error('Events validation failed:', eventsValidation.error);
    }
    
    response.json(events);
  } catch (error) {
    logger.error('Error fetching calendar events:', error);
    response.status(500).json({
      error: 'Failed to fetch calendar events',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ErrorResponse);
  }
}

/**
 * Handle POST requests to create calendar events
 * Flow: Natural Language → EventJSON → Google Calendar
 */
async function handleCreateCalendarEvent(request: any, response: any) {
  try {
    // Step 1: Validate request body using Zod schema
    const validationResult = NaturalLanguageInputSchema.safeParse(request.body);
    
    if (!validationResult.success) {
      return response.status(400).json({
        error: 'Invalid input',
        code: 'INVALID_REQUEST',
        details: validationResult.error.errors
      } as ErrorResponse);
    }
    
    const { text } = validationResult.data;
    const userId = request.headers['user-id'] || 'default-user'; // TODO: Get from auth
    
    // Step 2: Process through NaturalLanguageHandler (following class diagram flow)
    const naturalLanguageHandler = new NaturalLanguageHandler();
    
    // This follows the exact flow from the class diagram:
    // 1. Get natural language input
    // 2. Create EventJSON (via GPTService → EventValidator)
    // 3. Put calendar event to Google Calendar (via CalendarService)
    const eventJSON = await naturalLanguageHandler.handleRequest(text, userId);
    
    // Step 3: Return the created event
    response.status(201).json({
      success: true,
      message: 'Calendar event created successfully',
      data: eventJSON
    });
  } catch (error) {
    logger.error('Error creating calendar event:', error);
    response.status(500).json({
      error: 'Failed to create calendar event',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ErrorResponse);
  }
}

/**
 * Handle PUT requests to update calendar events
 * Flow: Natural Language → EventJSON → Google Calendar Update
 */
async function handleUpdateCalendarEvent(request: any, response: any) {
  try {
    const { id: eventId } = request.params;
    
    if (!eventId) {
      return response.status(400).json({
        error: 'Event ID is required',
        code: 'MISSING_EVENT_ID'
      } as ErrorResponse);
    }
    
    // Validate request body using Zod schema
    const updateValidation = EventUpdateInputSchema.safeParse(request.body);
    
    if (!updateValidation.success) {
      return response.status(400).json({
        error: 'Invalid update data',
        code: 'INVALID_UPDATE_DATA',
        details: updateValidation.error.errors
      } as ErrorResponse);
    }
    
    const updateData = updateValidation.data;
    const userId = request.headers['user-id'] || 'default-user'; // TODO: Get from auth
    
    // For updates, we can either:
    // 1. Use structured data directly (current approach)
    // 2. Use natural language processing (if updateData contains natural language)
    
    const calendarService = new CalendarService();
    
    // Convert EventUpdateInput to CalendarEvent format
    const eventJSON = {
      kind: 'calendar#event',
      etag: `"${Date.now()}"`,
      id: eventId,
      summary: updateData.title || '',
      description: updateData.description,
      start: updateData.start ? { dateTime: updateData.start } : { dateTime: new Date().toISOString() },
      end: updateData.end ? { dateTime: updateData.end } : { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
      location: updateData.location,
      attendees: updateData.attendees?.map(email => ({ email })) || []
    };
    
    await calendarService.updateEvent(userId, eventId, eventJSON);
    
    response.json({
      success: true,
      message: 'Calendar event updated successfully',
      data: { ...eventJSON }
    });
  } catch (error) {
    logger.error('Error updating calendar event:', error);
    response.status(500).json({
      error: 'Failed to update calendar event',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ErrorResponse);
  }
}

/**
 * Handle DELETE requests to remove calendar events
 * Flow: Delete from Google Calendar
 */
async function handleDeleteCalendarEvent(request: any, response: any) {
  try {
    const { id: eventId } = request.params;
    
    if (!eventId) {
      return response.status(400).json({
        error: 'Event ID is required',
        code: 'MISSING_EVENT_ID'
      } as ErrorResponse);
    }
    
    const userId = request.headers['user-id'] || 'default-user'; // TODO: Get from auth
    const calendarService = new CalendarService();
    
    await calendarService.deleteEvent(userId, eventId);
    
    const response_data: SuccessResponse = {
      success: true,
      message: 'Calendar event deleted successfully'
    };
    
    // Validate response using Zod schema
    const responseValidation = SuccessResponseSchema.safeParse(response_data);
    if (!responseValidation.success) {
      console.error('Response validation failed:', responseValidation.error);
    }
    
    response.json(response_data);
  } catch (error) {
    logger.error('Error deleting calendar event:', error);
    response.status(500).json({
      error: 'Failed to delete calendar event',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ErrorResponse);
  }
}
