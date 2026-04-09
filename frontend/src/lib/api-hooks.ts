import {
  cancelGuestBooking,
  cancelOwnerBooking,
  createBooking,
  createEventType,
  getGuestBooking,
  getOwner,
  getOwnerBooking,
  listAvailableSlots,
  listOwnerEventTypes,
  listPublicEventTypes,
  listUpcomingBookings,
  queryKeys,
  updateEventType,
  type AvailableSlotsQuery,
  type BookingCreateInput,
  type EventTypeCreateInput,
  type EventTypeUpdateInput,
  type OwnerBookingsQuery,
} from "@calendar-booking/api-client";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

function serializeSearchRecord(record: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

export function useOwner() {
  return useQuery({
    queryKey: queryKeys.owner,
    queryFn: getOwner,
    staleTime: 60_000,
  });
}

export function useOwnerEventTypes() {
  return useQuery({
    queryKey: queryKeys.ownerEventTypes,
    queryFn: listOwnerEventTypes,
  });
}

export function useCreateEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EventTypeCreateInput) => createEventType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerEventTypes });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicEventTypes });
    },
  });
}

export function useUpdateEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventTypeId, payload }: { eventTypeId: string; payload: EventTypeUpdateInput }) =>
      updateEventType(eventTypeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerEventTypes });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicEventTypes });
    },
  });
}

export function useOwnerBookings(query: OwnerBookingsQuery) {
  const normalizedQuery = query ?? {};

  return useQuery({
    queryKey: queryKeys.ownerBookings(
      serializeSearchRecord({
        from: normalizedQuery.from,
        limit: normalizedQuery.limit,
        offset: normalizedQuery.offset,
      }),
    ),
    queryFn: () => listUpcomingBookings(normalizedQuery),
  });
}

export function useOwnerBooking(bookingId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.ownerBooking(bookingId ?? ""),
    queryFn: () => getOwnerBooking(bookingId ?? ""),
    enabled: Boolean(bookingId),
  });
}

export function useCancelOwnerBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelOwnerBooking(bookingId),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ["owner", "bookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerBooking(bookingId) });
    },
  });
}

export function usePublicEventTypes() {
  return useQuery({
    queryKey: queryKeys.publicEventTypes,
    queryFn: listPublicEventTypes,
  });
}

export function useAvailableSlots(query: AvailableSlotsQuery | undefined) {
  const search = query ? serializeSearchRecord(query) : "idle";

  return useQuery({
    queryKey: query ? queryKeys.slots(query.eventTypeId, search) : ["public", "slots", "idle"],
    queryFn: () => listAvailableSlots(query as AvailableSlotsQuery),
    enabled: Boolean(query),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingCreateInput) => createBooking(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["public", "slots", payload.eventTypeId] });
    },
  });
}

export function useGuestBooking(token: string | undefined) {
  return useQuery({
    queryKey: queryKeys.guestBooking(token ?? ""),
    queryFn: () => getGuestBooking(token ?? ""),
    enabled: Boolean(token),
  });
}

export function useCancelGuestBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => cancelGuestBooking(token),
    onSuccess: (_, token) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guestBooking(token) });
      queryClient.invalidateQueries({ queryKey: ["owner", "bookings"] });
    },
  });
}
