import { endOfDay, format, isSameDay, startOfDay } from "date-fns";
import type { Slot } from "@calendar-booking/api-client";

export const browserTimezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export function formatDateTime(value: string) {
  return format(new Date(value), "EEE, dd MMM yyyy, HH:mm");
}

export function formatDate(value: string) {
  return format(new Date(value), "EEEE, dd MMM yyyy");
}

export function formatTime(value: string) {
  return format(new Date(value), "HH:mm");
}

export function getSlotQueryRange(date: Date) {
  return {
    from: startOfDay(date).toISOString(),
    to: endOfDay(date).toISOString(),
    timezone: browserTimezone,
    limit: 200,
    offset: 0,
  };
}

export function isTodaySelected(date: Date) {
  return isSameDay(date, new Date());
}

export function groupSlotsByDay(slots: Slot[]) {
  return slots.reduce<Record<string, Slot[]>>((accumulator, slot) => {
    const key = format(new Date(slot.startAt), "yyyy-MM-dd");
    accumulator[key] ??= [];
    accumulator[key].push(slot);
    return accumulator;
  }, {});
}
