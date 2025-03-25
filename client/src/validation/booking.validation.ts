import { z } from "zod"

export const bookingSchema = z.object({
  eventId: z.number().positive("Event ID must be positive"),
  userId: z.number().positive("User ID must be positive"),
  numberOfTickets: z.number().int().min(1, "Number of tickets must be at least 1"),
})

export type BookingFormValues = z.infer<typeof bookingSchema>


