import { create } from "zustand"
import { BookingService } from "../services/booking.service"
import type { Booking, BookingRequestDto, BookingStatus } from "../types/booking.types"

interface BookingState {
  bookings: Booking[]
  selectedBooking: Booking | null
  isLoading: boolean
  error: string | null
  pagination: {
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
  }

  fetchBookingsByUser: (userId: number, pageNum?: number, pageSize?: number) => Promise<void>
  fetchBookingsByEvent: (eventId: number, pageNum?: number, pageSize?: number) => Promise<void>
  fetchBookingById: (id: number) => Promise<void>
  createBooking: (bookingData: BookingRequestDto) => Promise<Booking>
  updateBookingStatus: (id: number, status: BookingStatus) => Promise<void>
  cancelBooking: (id: number) => Promise<void>
  setSelectedBooking: (booking: Booking | null) => void
  clearError: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },

  fetchBookingsByUser: async (userId, pageNum = 0, pageSize = 10) => {
    try {
      set({ isLoading: true, error: null })
      const response = await BookingService.getBookingsByUser(userId, pageNum, pageSize)
      set({
        bookings: response.content,
        pagination: {
          pageNumber: response.pageable.pageNumber,
          pageSize: response.pageable.pageSize,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        },
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch bookings for user ID: ${userId}`,
      })
    }
  },

  fetchBookingsByEvent: async (eventId, pageNum = 0, pageSize = 10) => {
    try {
      set({ isLoading: true, error: null })
      const response = await BookingService.getBookingsByEvent(eventId, pageNum, pageSize)
      set({
        bookings: response.content,
        pagination: {
          pageNumber: response.pageable.pageNumber,
          pageSize: response.pageable.pageSize,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        },
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch bookings for event ID: ${eventId}`,
      })
    }
  },

  fetchBookingById: async (bookingId) => {
    try {
      set({ isLoading: true, error: null })
      const response = await BookingService.getBookingById(bookingId)
      set({ selectedBooking: response, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch booking with ID: ${bookingId}`,
      })
    }
  },

  createBooking: async (bookingData) => {
    try {
      set({ isLoading: true, error: null })
      const newBooking = await BookingService.createBooking(bookingData)
      set((state) => ({
        bookings: [...state.bookings, newBooking],
        selectedBooking: newBooking,
        isLoading: false,
      }))
      return newBooking
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create booking",
      })
      throw error
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null })
      const updatedBooking = await BookingService.updateBookingStatus(id, status)
      set((state) => ({
        bookings: state.bookings.map((booking) => (booking.id === id ? updatedBooking : booking)),
        selectedBooking: state.selectedBooking?.id === id ? updatedBooking : state.selectedBooking,
        isLoading: false,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to update booking status for ID: ${id}`,
      })
      throw error
    }
  },

  cancelBooking: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await BookingService.cancelBooking(id)
      set((state) => ({
        bookings: state.bookings.filter((booking) => booking.id !== id),
        selectedBooking: state.selectedBooking?.id === id ? null : state.selectedBooking,
        isLoading: false,
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to cancel booking with ID: ${id}`,
      })
      throw error
    }
  },

  setSelectedBooking: (booking) => {
    set({ selectedBooking: booking })
  },

  clearError: () => {
    set({ error: null })
  },
}))


