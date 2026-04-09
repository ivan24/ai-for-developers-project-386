import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { api } from "./client";
import type { BookingCreateInput, EventTypeCreateInput } from "./types";

const queryKeys = {
  publicEventTypes: ["public-event-types"] as const,
  ownerEventTypes: ["owner-event-types"] as const,
  ownerBookings: ["owner-bookings"] as const,
  availableSlots: (input: {
    eventTypeId: string;
    from: string;
    to: string;
    timezone?: string;
    limit?: number;
    offset?: number;
  }) => ["available-slots", input] as const,
};

export const usePublicEventTypes = () =>
  useQuery({
    queryKey: queryKeys.publicEventTypes,
    queryFn: api.getPublicEventTypes,
  });

export const useAvailableSlots = (input: {
  eventTypeId?: string;
  date: Date | string;
}) =>
  useQuery({
    queryKey: queryKeys.availableSlots({
      eventTypeId: input.eventTypeId ?? "",
      from: dayjs(input.date).startOf("day").toISOString(),
      to: dayjs(input.date).endOf("day").toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      limit: 24,
      offset: 0,
    }),
    queryFn: () =>
      api.getAvailableSlots({
        eventTypeId: input.eventTypeId!,
        from: dayjs(input.date).startOf("day").toISOString(),
        to: dayjs(input.date).endOf("day").toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        limit: 24,
        offset: 0,
      }),
    enabled: Boolean(input.eventTypeId),
  });

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (input: BookingCreateInput) => api.createBooking(input),
  });
};

export const useOwnerEventTypes = () =>
  useQuery({
    queryKey: queryKeys.ownerEventTypes,
    queryFn: api.getOwnerEventTypes,
  });

export const useCreateEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EventTypeCreateInput) => api.createEventType(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.ownerEventTypes }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicEventTypes }),
      ]);
    },
  });
};

export const useUpcomingBookings = () =>
  useQuery({
    queryKey: queryKeys.ownerBookings,
    queryFn: () =>
      api.getUpcomingBookings({
        from: dayjs().toISOString(),
        limit: 20,
        offset: 0,
      }),
  });

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => api.cancelBooking(bookingId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.ownerBookings });
    },
  });
};
