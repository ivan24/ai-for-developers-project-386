import axios from "axios";
import type {
  Booking,
  BookingCreateInput,
  BookingListResponse,
  EventType,
  EventTypeCreateInput,
  EventTypeListResponse,
  GuestBookingCreatedResponse,
  SlotListResponse,
} from "@/shared/api/types";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  async getPublicEventTypes() {
    const { data } = await apiClient.get<EventTypeListResponse>(
      "/public/event-types",
    );

    return data.items;
  },
  async getAvailableSlots(input: {
    eventTypeId: string;
    from: string;
    to: string;
    timezone?: string;
    limit?: number;
    offset?: number;
  }) {
    const { eventTypeId, ...params } = input;
    const { data } = await apiClient.get<SlotListResponse>(
      `/public/event-types/${eventTypeId}/slots`,
      { params },
    );

    return data;
  },
  async createBooking(input: BookingCreateInput) {
    const { data } = await apiClient.post<GuestBookingCreatedResponse>(
      "/public/bookings",
      input,
    );

    return data;
  },
  async getOwnerEventTypes() {
    const { data } = await apiClient.get<EventTypeListResponse>(
      "/owner/event-types",
    );

    return data.items;
  },
  async createEventType(input: EventTypeCreateInput) {
    const { data } = await apiClient.post<EventType>("/owner/event-types", input);

    return data;
  },
  async getUpcomingBookings(input?: {
    from?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data } = await apiClient.get<BookingListResponse>("/owner/bookings", {
      params: input,
    });

    return data;
  },
  async cancelBooking(bookingId: string) {
    const { data } = await apiClient.post<Booking>(
      `/owner/bookings/${bookingId}/cancel`,
    );

    return data;
  },
};
