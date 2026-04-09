export type EventType = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
};

export type Slot = {
  eventTypeId: string;
  startAt: string;
  endAt: string;
  isAvailable: boolean;
};

export type BookingStatus = "active" | "cancelled";

export type Booking = {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  startAt: string;
  endAt: string;
  guestName: string;
  guestEmail: string;
  createdAt: string;
  status: BookingStatus;
};

export type GuestBooking = Booking & {
  guestCancelToken: string;
};

export type EventTypeListResponse = {
  items: EventType[];
};

export type SlotListResponse = {
  items: Slot[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type BookingListResponse = {
  items: Booking[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type GuestBookingCreatedResponse = {
  booking: GuestBooking;
};

export type EventTypeCreateInput = {
  name: string;
  description?: string;
  durationMinutes: number;
};

export type BookingCreateInput = {
  eventTypeId: string;
  startAt: string;
  guestName: string;
  guestEmail: string;
};

export type ApiErrorPayload = {
  code?: string;
  message?: string;
};
