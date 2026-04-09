import type { QueryKey } from "@tanstack/react-query";

export const queryKeys = {
  owner: ["owner"] as QueryKey,
  ownerEventTypes: ["owner", "event-types"] as QueryKey,
  ownerBookings: (search: string) => ["owner", "bookings", search] as QueryKey,
  ownerBooking: (bookingId: string) => ["owner", "bookings", bookingId] as QueryKey,
  publicEventTypes: ["public", "event-types"] as QueryKey,
  slots: (eventTypeId: string, search: string) =>
    ["public", "slots", eventTypeId, search] as QueryKey,
  guestBooking: (token: string) => ["public", "booking", token] as QueryKey,
};
