// Auto-generated TypeScript type definitions
// This file is auto-generated from OpenAPI schema
// Do not edit manually

export interface NaturalLanguageInput {
  text: string
}

export interface ValidationResponse {
  valid: boolean;
  message?: string
}

export interface CalendarEvent {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  description?: string;
  location?: string;
  colorId?: string;
  start: {
  date?: string;
  dateTime?: string;
  timeZone?: string
};
  end: {
  date?: string;
  dateTime?: string;
  timeZone?: string
};
  recurrence?: string[];
  attendees?: {
  id?: string;
  email?: string;
  displayName?: string;
  organizer?: boolean;
  self?: boolean;
  resource?: boolean;
  optional?: boolean;
  responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  comment?: string;
  additionalGuests?: number
}[];
  creator?: {
  id?: string;
  email?: string;
  displayName?: string;
  self?: boolean
};
  organizer?: {
  id?: string;
  email?: string;
  displayName?: string;
  self?: boolean
};
  visibility?: "default" | "public" | "private" | "confidential";
  transparency?: "opaque" | "transparent";
  status?: "confirmed" | "tentative" | "cancelled";
  htmlLink?: string;
  iCalUID?: string;
  sequence?: number;
  reminders?: {
  useDefault?: boolean;
  overrides?: {
  method?: "email" | "popup";
  minutes?: number
}[]
};
  source?: {
  url?: string;
  title?: string
};
  hangoutLink?: string;
  conferenceData?: {
  createRequest?: {
  requestId?: string;
  conferenceSolutionKey?: {
  type?: string
};
  status?: {
  statusCode?: "pending" | "success" | "failure"
}
};
  entryPoints?: {
  entryPointType?: "video" | "phone" | "sip" | "more";
  uri?: string;
  label?: string;
  pin?: string;
  accessCode?: string;
  meetingCode?: string;
  passcode?: string;
  password?: string
}[];
  conferenceSolution?: {
  key?: {
  type?: string
};
  name?: string;
  iconUri?: string
};
  conferenceId?: string;
  signature?: string
};
  gadget?: {
  type?: string;
  title?: string;
  link?: string;
  iconLink?: string;
  width?: number;
  height?: number;
  display?: "chip" | "icon";
  preferences?: Record<string, any>
};
  anyoneCanAddSelf?: boolean;
  guestsCanInviteOthers?: boolean;
  guestsCanModify?: boolean;
  guestsCanSeeOtherGuests?: boolean;
  privateCopy?: boolean;
  locked?: boolean
}

export interface EventUpdateInput {
  title?: string;
  description?: string;
  start?: string;
  end?: string;
  location?: string;
  attendees?: string[]
}

export interface GoogleCalendarEvent {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  description?: string;
  location?: string;
  timeZone?: string;
  colorId?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  hidden?: boolean;
  selected?: boolean;
  accessRole?: "freeBusyReader" | "reader" | "writer" | "owner";
  defaultReminders?: {
  method?: "email" | "popup";
  minutes?: number
}[];
  notificationSettings?: {
  notifications?: {
  type?: "eventCreation" | "eventChange" | "eventCancellation" | "eventResponse" | "agenda";
  method?: "email"
}[]
}
}

export interface SuccessResponse {
  success: boolean;
  message?: string
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>
}

export interface validateScheduleCreationRequest extends NaturalLanguageInput {}

export interface validateScheduleCreationResponse extends ValidationResponse {}

export interface getScheduledEventsResponse extends Array<CalendarEvent> {}

export interface deleteScheduledEventResponse extends SuccessResponse {}

export interface updateScheduledEventRequest extends EventUpdateInput {}

export interface updateScheduledEventResponse extends CalendarEvent {}

// Common API type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// HTTP method type
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API endpoint type
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  operationId: string;
}
