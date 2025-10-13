import * as z from 'zod'

export const reservationSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(1, 'Phone number is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  partySize: z.number().min(1, 'Party size must be at least 1'),
  specialRequests: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString())
})

export type Reservation = z.infer<typeof reservationSchema>

export const createReservationSchema = reservationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const updateReservationSchema = reservationSchema.partial().omit({
  id: true,
  createdAt: true
})

export type CreateReservation = z.infer<typeof createReservationSchema>
export type UpdateReservation = z.infer<typeof updateReservationSchema>
