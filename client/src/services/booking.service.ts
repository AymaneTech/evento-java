import apiClient from "../api/axios"
import type { BookingRequestDto, BookingResponseDto, BookingsPage, BookingStatus } from "../types/booking.types"

const API_PATH = "/v1/bookings"

export const BookingService = {
  createBooking: async (bookingData: BookingRequestDto): Promise<BookingResponseDto> => {
    const response = await apiClient.post<BookingResponseDto>(API_PATH, bookingData)
    return response.data
  },

  getBookingById: async (id: number): Promise<BookingResponseDto> => {
    const response = await apiClient.get<BookingResponseDto>(`${API_PATH}/${id}`)
    return response.data
  },

  getBookingsByUser: async (userId: number, pageNum: number = 0, pageSize: number = 10): Promise<BookingsPage> => {
    const response = await apiClient.get<BookingsPage>(
      `${API_PATH}/user/${userId}?pageNum=${pageNum}&pageSize=${pageSize}`
    )
    return response.data
  },

  getBookingsByEvent: async (eventId: number, pageNum: number = 0, pageSize: number = 10): Promise<BookingsPage> => {
    const response = await apiClient.get<BookingsPage>(
      `${API_PATH}/event/${eventId}?pageNum=${pageNum}&pageSize=${pageSize}`
    )
    return response.data
  },

  updateBookingStatus: async (id: number, status: BookingStatus): Promise<BookingResponseDto> => {
    const response = await apiClient.patch<BookingResponseDto>(
      `${API_PATH}/${id}/status?status=${status}`
    )
    return response.data
  },

  cancelBooking: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_PATH}/${id}`)
  }
}

