import * as z from 'zod'

export const dateTimeSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    'Time must be in HH:MM format'
  ),
})

export const dateTimeFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required')
})

export type DateTime = z.infer<typeof dateTimeSchema>
export type DateTimeForm = z.infer<typeof dateTimeFormSchema>

// Context type for date/time management
export interface DateTimeContextType {
  dateTime: DateTimeForm
  setDateTime: (dateTime: DateTimeForm) => void
  updateDate: (date: string) => void
  updateTime: (time: string) => void
  resetDateTime: () => void
}
