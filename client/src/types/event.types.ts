export enum BookingType {
  AUTOMATIC = "AUTOMATIC",
  MANUAL = "MANUAL",
}

export interface NestedCategory {
  id: number
  name: string
  slug: string
}

export interface NestedUser {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface EventResponseDto {
  id: number
  title: string
  slug: string
  description: string
  numberOfSeats: number
  price: number
  date: string // ISO string format
  location: string
  bookingType: BookingType
  category: NestedCategory
  organiser: NestedUser
}

export interface EventRequestDto {
  title: string
  description: string
  numberOfSeats: number
  price: number
  date: string
  location: string
  bookingType: BookingType
  categoryId: number
  userId: number
  image?: File
}

export interface Event {
  id: number
  title: string
  slug: string
  description: string
  numberOfSeats: number
  price: number
  date: string
  location: string
  bookingType: BookingType
  category: NestedCategory
  organiser: NestedUser
  imageUrl?: string
}

export interface EventsPage {
  content: Event[]
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


