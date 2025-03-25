import type { NestedCategory } from "./category.types"

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

export interface NestedEvent {
  id: number
  title: string
  slug: string
  description: string
  price: number
  date: string
  location: string
  category: NestedCategory
  imageUrl?: string
}

export interface NestedUser {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface BookingRequestDto {
  eventId: number
  userId: number
  numberOfTickets: number
}

export interface BookingResponseDto {
  id: number
  event: NestedEvent
  user: NestedUser
  status: BookingStatus
  numberOfTickets: number
  totalPrice: number
  bookingDate: string
}

export interface Booking {
  id: number
  event: NestedEvent
  user: NestedUser
  status: BookingStatus
  numberOfTickets: number
  totalPrice: number
  bookingDate: string
}

export interface BookingsPage {
  content: Booking[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  empty: boolean
}

