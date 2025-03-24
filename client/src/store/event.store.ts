import { create } from "zustand"
import { EventService } from "../services/event.service"
import type { Event, EventRequestDto, BookingType } from "../types/event.types"

interface EventState {
  events: Event[]
  selectedEvent: Event | null
  isLoading: boolean
  error: string | null
  pagination: {
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
  }

  fetchAllEvents: (pageNum?: number, pageSize?: number) => Promise<void>
  fetchEventById: (id: number) => Promise<void>
  fetchEventsByOrganizerId: (organizerId: number, pageNum?: number, pageSize?: number) => Promise<void>
  searchEventsByTitle: (title: string, pageNum?: number, pageSize?: number) => Promise<void>
  createEvent: (eventData: EventRequestDto) => Promise<void>
  updateEvent: (id: number, eventData: EventRequestDto) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
  setReservationApprovalMode: (id: number, bookingType: BookingType) => Promise<void>
  toggleEventValidationStatus: (id: number) => Promise<void>
  setSelectedEvent: (event: Event | null) => void
  clearError: () => void
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },

  fetchAllEvents: async (pageNum = 0, pageSize = 10) => {
    try {
      set({ isLoading: true, error: null })
      const response = await EventService.getAllEvents(pageNum, pageSize)
      set({
        events: response.content,
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
        error: error instanceof Error ? error.message : "Failed to fetch events",
      })
    }
  },

  fetchEventById: async (eventId) => {
    try {
      set({ isLoading: true, error: null })
      const response = await EventService.getEventById(eventId)
      set({ selectedEvent: response, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch event with ID: ${eventId}`,
      })
    }
  },

  fetchEventsByOrganizerId: async (organizerId, pageNum = 0, pageSize = 10) => {
    try {
      set({ isLoading: true, error: null })
      const response = await EventService.getEventsByOrganizerId(organizerId, pageNum, pageSize)
      set({
        events: response.content,
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
        error: error instanceof Error ? error.message : `Failed to fetch events for organizer ID: ${organizerId}`,
      })
    }
  },

  searchEventsByTitle: async (title, pageNum = 0, pageSize = 10) => {
    try {
      set({ isLoading: true, error: null })
      const response = await EventService.searchEventsByTitle(title, pageNum, pageSize)
      set({
        events: response.content,
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
        error: error instanceof Error ? error.message : `Failed to search events with title: ${title}`,
      })
    }
  },

  createEvent: async (eventData) => {
    try {
      set({ isLoading: true, error: null })
      const newEvent = await EventService.createEvent(eventData)
      set((state) => ({
        events: [...state.events, newEvent],
        isLoading: false,
      }))
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create event",
      })
      return Promise.reject(error)
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      set({ isLoading: true, error: null })
      const updatedEvent = await EventService.updateEvent(id, eventData)
      set((state) => ({
        events: state.events.map((event) => (event.id === id ? updatedEvent : event)),
        selectedEvent: state.selectedEvent?.id === id ? updatedEvent : state.selectedEvent,
        isLoading: false,
      }))
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to update event with ID: ${id}`,
      })
      return Promise.reject(error)
    }
  },

  deleteEvent: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await EventService.deleteEvent(id)
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
        isLoading: false,
      }))
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to delete event with ID: ${id}`,
      })
      return Promise.reject(error)
    }
  },

  setReservationApprovalMode: async (id, bookingType) => {
    try {
      set({ isLoading: true, error: null })
      await EventService.setReservationApprovalMode(id, bookingType)
      set((state) => ({
        events: state.events.map((event) => (event.id === id ? { ...event, bookingType } : event)),
        selectedEvent: state.selectedEvent?.id === id ? { ...state.selectedEvent, bookingType } : state.selectedEvent,
        isLoading: false,
      }))
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : `Failed to set reservation approval mode for event with ID: ${id}`,
      })
      return Promise.reject(error)
    }
  },

  toggleEventValidationStatus: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await EventService.toggleEventValidationStatus(id)
      // Since we don't know the new status from the API response,
      // we'll need to refetch the event to get the updated status
      await get().fetchEventById(id)
      return Promise.resolve()
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to toggle validation status for event with ID: ${id}`,
      })
      return Promise.reject(error)
    }
  },

  setSelectedEvent: (event) => {
    set({ selectedEvent: event })
  },

  clearError: () => {
    set({ error: null })
  },
}))


