import apiClient from "../api/axios";
import { EventRequestDto, EventResponseDto, EventsPage, BookingType } from "../types/event.types";

const API_PATH = "/v1/events";

export const EventService = {
  createEvent: async (eventData: EventRequestDto): Promise<EventResponseDto> => {
    const response = await apiClient.post<EventResponseDto>(API_PATH, eventData);
    return response.data;
  },

  getEventById: async (id: number): Promise<EventResponseDto> => {
    const response = await apiClient.get<EventResponseDto>(`${API_PATH}/${id}`);
    return response.data;
  },

  getAllEvents: async (pageNum: number = 0, pageSize: number = 10): Promise<EventsPage> => {
    const response = await apiClient.get<EventsPage>(
      `${API_PATH}?pageNum=${pageNum}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getEventsByOrganizerId: async (
    organizerId: number,
    pageNum: number = 0,
    pageSize: number = 10
  ): Promise<EventsPage> => {
    const response = await apiClient.get<EventsPage>(
      `${API_PATH}/${organizerId}?pageNum=${pageNum}&pageSize=${pageSize}`
    );
    return response.data;
  },

  searchEventsByTitle: async (
    title: string,
    pageNum: number = 0,
    pageSize: number = 10
  ): Promise<EventsPage> => {
    const response = await apiClient.get<EventsPage>(
      `${API_PATH}/${title}?pageNum=${pageNum}&pageSize=${pageSize}`
    );
    return response.data;
  },

  updateEvent: async (id: number, eventData: EventRequestDto): Promise<EventResponseDto> => {
    const response = await apiClient.put<EventResponseDto>(`${API_PATH}/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_PATH}/${id}`);
  },

  setReservationApprovalMode: async (id: number, bookingType: BookingType): Promise<void> => {
    await apiClient.get(`${API_PATH}/${id}/${bookingType}`);
  },

  toggleEventValidationStatus: async (id: number): Promise<void> => {
    await apiClient.get(`${API_PATH}/status/toggle/${id}`);
  },
};


