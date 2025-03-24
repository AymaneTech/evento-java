import { Category } from "./category.types";
import { User } from "./user.types";

export enum BookingType {
  AUTOMATIC = "AUTOMATIC",
  MANUAL = "MANUAL"
}

export interface NestedCategory {
  id: number;
  name: string;
  slug: string;
}

export interface NestedUser {
  id: number;
  username: string;
  email: string;
}

export interface EventResponseDto {
  id: number;
  title: string;
  slug: string;
  description: string;
  numberOfSeats: number;
  price: number;
  date: string; // ISO string format
  location: string;
  bookingType: BookingType;
  category: NestedCategory;
  user: NestedUser;
}

export interface EventRequestDto {
  title: string;
  description: string;
  numberOfSeats: number;
  price: number;
  date: string; // ISO string format
  location: string;
  bookingType: BookingType;
  categoryId: number;
  userId: number;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  numberOfSeats: number;
  price: number;
  date: string; // ISO string format
  location: string;
  bookingType: BookingType;
  category: NestedCategory;
  user: NestedUser;
}

export interface EventsPage {
  content: Event[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

