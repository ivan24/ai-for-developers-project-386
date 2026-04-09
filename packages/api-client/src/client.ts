import createClient from "openapi-fetch";
import type { components, operations, paths } from "./generated";

const apiClient = createClient<paths>({
  baseUrl: "/api",
});

export class ApiError<T = unknown> extends Error {
  status: number;
  data: T | undefined;

  constructor(message: string, status: number, data?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function unwrap<T>(
  promise: Promise<{
    data?: T;
    error?: unknown;
    response: Response;
  }>,
  fallbackMessage: string,
): Promise<T> {
  const { data, error, response } = await promise;

  if (error) {
    const message =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
        ? error.message
        : fallbackMessage;

    throw new ApiError(message, response.status, error);
  }

  if (!data) {
    throw new ApiError(fallbackMessage, response.status);
  }

  return data;
}

export type Owner = components["schemas"]["Owner"];
export type EventType = components["schemas"]["EventType"];
export type EventTypeCreateInput = components["schemas"]["EventTypeCreateInput"];
export type EventTypeUpdateInput = components["schemas"]["EventTypeUpdateInput"];
export type Slot = components["schemas"]["Slot"];
export type Booking = components["schemas"]["Booking"];
export type GuestBooking = components["schemas"]["GuestBooking"];
export type BookingCreateInput = components["schemas"]["BookingCreateInput"];
export type PaginatedMeta = components["schemas"]["PaginatedMeta"];
export type ErrorResponse = components["schemas"]["ErrorResponse"];
export type ValidationErrorResponse = components["schemas"]["ValidationErrorResponse"];
export type ConflictErrorResponse = components["schemas"]["ConflictErrorResponse"];
export type NotFoundErrorResponse = components["schemas"]["NotFoundErrorResponse"];

export type OwnerBookingsQuery =
  operations["OwnerApi_listUpcomingBookings"]["parameters"]["query"];

export type AvailableSlotsQuery =
  operations["PublicApi_listAvailableSlots"]["parameters"]["query"] & {
    eventTypeId: string;
  };

export async function getOwner() {
  return unwrap(apiClient.GET("/owner"), "Failed to load owner profile.");
}

export async function listOwnerEventTypes() {
  return unwrap(
    apiClient.GET("/owner/event-types"),
    "Failed to load owner event types.",
  );
}

export async function createEventType(body: EventTypeCreateInput) {
  return unwrap(
    apiClient.POST("/owner/event-types", { body }),
    "Failed to create event type.",
  );
}

export async function updateEventType(
  eventTypeId: string,
  body: EventTypeUpdateInput,
) {
  return unwrap(
    apiClient.PATCH("/owner/event-types/{eventTypeId}", {
      params: {
        path: { eventTypeId },
      },
      body,
    }),
    "Failed to update event type.",
  );
}

export async function listUpcomingBookings(query: OwnerBookingsQuery = {}) {
  return unwrap(
    apiClient.GET("/owner/bookings", {
      params: { query },
    }),
    "Failed to load owner bookings.",
  );
}

export async function getOwnerBooking(bookingId: string) {
  return unwrap(
    apiClient.GET("/owner/bookings/{bookingId}", {
      params: {
        path: { bookingId },
      },
    }),
    "Failed to load booking details.",
  );
}

export async function cancelOwnerBooking(bookingId: string) {
  return unwrap(
    apiClient.POST("/owner/bookings/{bookingId}/cancel", {
      params: {
        path: { bookingId },
      },
    }),
    "Failed to cancel booking.",
  );
}

export async function listPublicEventTypes() {
  return unwrap(
    apiClient.GET("/public/event-types"),
    "Failed to load public event types.",
  );
}

export async function listAvailableSlots({ eventTypeId, ...query }: AvailableSlotsQuery) {
  return unwrap(
    apiClient.GET("/public/event-types/{eventTypeId}/slots", {
      params: {
        path: { eventTypeId },
        query,
      },
    }),
    "Failed to load available slots.",
  );
}

export async function createBooking(body: BookingCreateInput) {
  return unwrap(
    apiClient.POST("/public/bookings", { body }),
    "Failed to create booking.",
  );
}

export async function getGuestBooking(guestCancelToken: string) {
  return unwrap(
    apiClient.GET("/public/bookings/by-token/{guestCancelToken}", {
      params: {
        path: { guestCancelToken },
      },
    }),
    "Failed to load guest booking.",
  );
}

export async function cancelGuestBooking(guestCancelToken: string) {
  return unwrap(
    apiClient.POST("/public/bookings/by-token/{guestCancelToken}/cancel", {
      params: {
        path: { guestCancelToken },
      },
    }),
    "Failed to cancel guest booking.",
  );
}
