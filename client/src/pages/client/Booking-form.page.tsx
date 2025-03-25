"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingSchema, type BookingFormValues } from "../schemas/booking.schema"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import { formatCurrency } from "../utils/formatters"
import { Loader2, Minus, Plus } from "lucide-react"
import type { Event } from "../types/event.types"

interface BookingFormProps {
  event: Event
  userId: number
  onSubmit: (data: BookingFormValues) => void
  isSubmitting: boolean
}

export const BookingForm: React.FC<BookingFormProps> = ({ event, userId, onSubmit, isSubmitting }) => {
  const [ticketCount, setTicketCount] = useState(1)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventId: event.id,
      userId: userId,
      numberOfTickets: 1,
    },
  })

  const handleSubmit = (data: BookingFormValues) => {
    onSubmit(data)
  }

  const incrementTickets = () => {
    if (ticketCount < event.numberOfSeats) {
      const newCount = ticketCount + 1
      setTicketCount(newCount)
      form.setValue("numberOfTickets", newCount, { shouldValidate: true })
    }
  }

  const decrementTickets = () => {
    if (ticketCount > 1) {
      const newCount = ticketCount - 1
      setTicketCount(newCount)
      form.setValue("numberOfTickets", newCount, { shouldValidate: true })
    }
  }

  const totalPrice = event.price * ticketCount

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Event</span>
            <span className="font-medium">{event.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Price per ticket</span>
            <span className="font-medium">{formatCurrency(event.price)}</span>
          </div>

          <FormField
            control={form.control}
            name="numberOfTickets"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Number of tickets</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementTickets}
                      disabled={ticketCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-16 text-center"
                        min={1}
                        max={event.numberOfSeats}
                        {...field}
                        value={ticketCount}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value)
                          if (!isNaN(value) && value >= 1 && value <= event.numberOfSeats) {
                            setTicketCount(value)
                            field.onChange(value)
                          }
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementTickets}
                      disabled={ticketCount >= event.numberOfSeats}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            {event.bookingType === "AUTOMATIC"
              ? "Your booking will be automatically confirmed."
              : "Your booking will require approval from the event organizer."}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </form>
    </Form>
  )
}


