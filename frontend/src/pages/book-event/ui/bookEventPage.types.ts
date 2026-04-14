import type { EventType } from "@/shared/api/types";

export type BookingFlowState = ReturnType<
  typeof import("@/features/book-event/model/useBookingFlow").useBookingFlow
>;

export interface BookEventPageVariantProps {
  eventType: EventType;
  bookingFlow: BookingFlowState;
}
