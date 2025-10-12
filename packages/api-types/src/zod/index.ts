// 自動生成された Zod スキーマ
// このファイルは OpenAPI スキーマから自動生成されます
// 手動で編集しないでください

import { z } from 'zod';

export const NaturalLanguageInputSchema = z.object({
  text: z.string()
});

export type NaturalLanguageInput = z.infer<typeof NaturalLanguageInputSchema>;

export const ValidationResponseSchema = z.object({
  valid: z.boolean(),
  message: z.string().optional()
});

export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;

export const CalendarEventSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  id: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  colorId: z.string().optional(),
  start: z.object({
  date: z.string().optional(),
  dateTime: z.string().datetime().optional(),
  timeZone: z.string().optional()
}),
  end: z.object({
  date: z.string().optional(),
  dateTime: z.string().datetime().optional(),
  timeZone: z.string().optional()
}),
  recurrence: z.array(z.string()).optional(),
  attendees: z.array(z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  organizer: z.boolean().optional(),
  self: z.boolean().optional(),
  resource: z.boolean().optional(),
  optional: z.boolean().optional(),
  responseStatus: z.enum(["needsAction", "declined", "tentative", "accepted"]).optional(),
  comment: z.string().optional(),
  additionalGuests: z.number().optional()
})).optional(),
  creator: z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  self: z.boolean().optional()
}).optional(),
  organizer: z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  self: z.boolean().optional()
}).optional(),
  visibility: z.enum(["default", "public", "private", "confidential"]).optional(),
  transparency: z.enum(["opaque", "transparent"]).optional(),
  status: z.enum(["confirmed", "tentative", "cancelled"]).optional(),
  htmlLink: z.string().optional(),
  iCalUID: z.string().optional(),
  sequence: z.number().optional(),
  reminders: z.object({
  useDefault: z.boolean().optional(),
  overrides: z.array(z.object({
  method: z.enum(["email", "popup"]).optional(),
  minutes: z.number().optional()
})).optional()
}).optional(),
  source: z.object({
  url: z.string().optional(),
  title: z.string().optional()
}).optional(),
  hangoutLink: z.string().optional(),
  conferenceData: z.object({
  createRequest: z.object({
  requestId: z.string().optional(),
  conferenceSolutionKey: z.object({
  type: z.string().optional()
}).optional(),
  status: z.object({
  statusCode: z.enum(["pending", "success", "failure"]).optional()
}).optional()
}).optional(),
  entryPoints: z.array(z.object({
  entryPointType: z.enum(["video", "phone", "sip", "more"]).optional(),
  uri: z.string().optional(),
  label: z.string().optional(),
  pin: z.string().optional(),
  accessCode: z.string().optional(),
  meetingCode: z.string().optional(),
  passcode: z.string().optional(),
  password: z.string().optional()
})).optional(),
  conferenceSolution: z.object({
  key: z.object({
  type: z.string().optional()
}).optional(),
  name: z.string().optional(),
  iconUri: z.string().optional()
}).optional(),
  conferenceId: z.string().optional(),
  signature: z.string().optional()
}).optional(),
  gadget: z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  link: z.string().optional(),
  iconLink: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  display: z.enum(["chip", "icon"]).optional(),
  preferences: z.record(z.any()).optional()
}).optional(),
  anyoneCanAddSelf: z.boolean().optional(),
  guestsCanInviteOthers: z.boolean().optional(),
  guestsCanModify: z.boolean().optional(),
  guestsCanSeeOtherGuests: z.boolean().optional(),
  privateCopy: z.boolean().optional(),
  locked: z.boolean().optional()
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export const EventUpdateInputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  location: z.string().optional(),
  attendees: z.array(z.string()).optional()
});

export type EventUpdateInput = z.infer<typeof EventUpdateInputSchema>;

export const GoogleCalendarEventSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  id: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  timeZone: z.string().optional(),
  colorId: z.string().optional(),
  backgroundColor: z.string().optional(),
  foregroundColor: z.string().optional(),
  hidden: z.boolean().optional(),
  selected: z.boolean().optional(),
  accessRole: z.enum(["freeBusyReader", "reader", "writer", "owner"]).optional(),
  defaultReminders: z.array(z.object({
  method: z.enum(["email", "popup"]).optional(),
  minutes: z.number().optional()
})).optional(),
  notificationSettings: z.object({
  notifications: z.array(z.object({
  type: z.enum(["eventCreation", "eventChange", "eventCancellation", "eventResponse", "agenda"]).optional(),
  method: z.enum(["email"]).optional()
})).optional()
}).optional()
});

export type GoogleCalendarEvent = z.infer<typeof GoogleCalendarEventSchema>;

export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional()
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.any()).optional()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// 共通の API レスポンス型
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    count: z.number().optional(),
  });

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
};
