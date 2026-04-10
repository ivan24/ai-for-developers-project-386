import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { api } from "@/shared/api/client";

export const bookingQueryKeys = {
  upcoming: ["owner-bookings"] as const,
  availableSlots: (input: {
    eventTypeId: string;
    from: string;
    to: string;
    timezone?: string;
    limit?: number;
    offset?: number;
  }) => ["available-slots", input] as const,
};

export const useAvailableSlots = (input: {
  eventTypeId?: string;
  date: Date | string;
}) =>
  useQuery({
    queryKey: bookingQueryKeys.availableSlots({
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

export const useUpcomingBookings = () =>
  useQuery({
    queryKey: bookingQueryKeys.upcoming,
    queryFn: () =>
      api.getUpcomingBookings({
        from: dayjs().toISOString(),
        limit: 20,
        offset: 0,
      }),
  });
