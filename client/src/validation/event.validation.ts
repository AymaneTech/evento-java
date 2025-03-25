import { z } from "zod"
import { BookingType } from "../types/event.types"

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  numberOfSeats: z.number().int("Number of seats must be an integer").positive("Number of seats must be positive"),
  price: z.number().positive("Price must be positive"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must be less than 100 characters"),
  bookingType: z.nativeEnum(BookingType),
  categoryId: z.number().positive("Category ID must be positive"),
  userId: z.number().positive("User ID must be positive"),
  image: z
    .instanceof(File, { message: "Image is required" })
    .optional()
    .or(z.any())
    .refine(
      (file) => {
        if (!file) return true

        if (file instanceof File) {
          const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
          return validTypes.includes(file.type)
        }
        return true
      },
      {
        message: "File must be a valid image (JPEG, PNG, or GIF)",
      },
    )
    .refine(
      (file) => {
        if (!file) return true

        if (file instanceof File) {
          return file.size <= 5 * 1024 * 1024
        }
        return true
      },
      {
        message: "Image must be less than 5MB",
      },
    ),
})

export type EventFormValues = z.infer<typeof eventSchema>


