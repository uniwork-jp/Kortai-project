/**
 * Mock for @ai-assistant/api-types package
 * This avoids ES module parsing issues in Jest
 */

// Mock Zod schemas

// Mock Zod schemas
const NaturalLanguageInputSchema = {
  safeParse: (data) => {
    if (data && typeof data.text === 'string' && data.text.length > 0) {
      return { success: true, data };
    }
    return { 
      success: false, 
      error: { errors: [{ message: 'Invalid text field' }] }
    };
  }
};

const ValidationResponseSchema = {
  safeParse: (data) => {
    if (data && typeof data.valid === 'boolean') {
      return { success: true, data };
    }
    return { 
      success: false, 
      error: { errors: [{ message: 'Invalid validation response' }] }
    };
  }
};

const CalendarEventSchema = {
  safeParse: (data) => {
    if (data && data.kind && data.summary && data.start && data.end) {
      return { success: true, data };
    }
    return { 
      success: false, 
      error: { errors: [{ message: 'Invalid calendar event' }] }
    };
  },
  array: () => ({
    safeParse: (data) => {
      if (Array.isArray(data)) {
        return { success: true, data };
      }
      return { 
        success: false, 
        error: { errors: [{ message: 'Invalid array' }] }
      };
    }
  })
};

const EventUpdateInputSchema = {
  safeParse: (data) => {
    // Check if data has valid fields for event update
    if (data && typeof data === 'object' && 
        (data.title || data.description || data.start || data.end || data.location || data.attendees)) {
      return { success: true, data };
    }
    return { 
      success: false, 
      error: { errors: [{ message: 'Invalid update input' }] }
    };
  }
};

const SuccessResponseSchema = {
  safeParse: (data) => {
    if (data && typeof data.success === 'boolean') {
      return { success: true, data };
    }
    return { 
      success: false, 
      error: { errors: [{ message: 'Invalid success response' }] }
    };
  }
};

const ErrorResponseSchema = {
  safeParse: (data) => {
    if (data && typeof data.error === 'string') {
      return { success: true, data };
    }
    return { 
      success: false, 
      error: { errors: [{ message: 'Invalid error response' }] }
    };
  }
};

// Export as CommonJS module
module.exports = {
  NaturalLanguageInputSchema,
  ValidationResponseSchema,
  CalendarEventSchema,
  EventUpdateInputSchema,
  SuccessResponseSchema,
  ErrorResponseSchema
};
