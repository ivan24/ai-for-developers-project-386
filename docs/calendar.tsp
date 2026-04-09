import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{
  title: "Calendar Booking API",
})
@server("https://api.example.com", "Production server")
namespace CalendarBooking;

// ═════════════════════════════════════════════
// Scalars
// ═════════════════════════════════════════════

@format("date-time")
scalar UtcDateTime extends string;

@minLength(1)
scalar NonEmptyString extends string;

@minValue(1)
scalar PositiveInt extends int32;

@minValue(0)
scalar NonNegativeInt extends int32;

// ═════════════════════════════════════════════
// Models
// ═════════════════════════════════════════════

model Owner {
  id: string;
  name: string;
  timezone: NonEmptyString;
}

model EventType {
  id: string;
  name: NonEmptyString;
  description?: string;
  durationMinutes: PositiveInt;
}

model EventTypeCreateInput {
  name: NonEmptyString;
  description?: string;
  durationMinutes: PositiveInt;
}

model EventTypeUpdateInput {
  name?: NonEmptyString;
  description?: string;
  durationMinutes?: PositiveInt;
}

model Slot {
  eventTypeId: string;
  startAt: UtcDateTime;
  endAt: UtcDateTime;
  isAvailable: boolean;
}

model Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: NonEmptyString;
  startAt: UtcDateTime;
  endAt: UtcDateTime;
  guestName: NonEmptyString;
  guestEmail: NonEmptyString;
  createdAt: UtcDateTime;
  status: "active" | "cancelled";
}

model GuestBooking {
  id: string;
  eventTypeId: string;
  eventTypeName: NonEmptyString;
  startAt: UtcDateTime;
  endAt: UtcDateTime;
  guestName: NonEmptyString;
  guestEmail: NonEmptyString;
  createdAt: UtcDateTime;
  status: "active" | "cancelled";
  guestCancelToken: NonEmptyString;
}

model BookingCreateInput {
  eventTypeId: string;
  startAt: UtcDateTime;
  guestName: NonEmptyString;
  guestEmail: NonEmptyString;
}

model GuestBookingCreatedResponse {
  booking: GuestBooking;
}

// ═════════════════════════════════════════════
// Pagination
// ═════════════════════════════════════════════

model PaginationParams {
  @query limit?: PositiveInt;
  @query offset?: NonNegativeInt;
}

model PaginatedMeta {
  total: NonNegativeInt;
  limit: PositiveInt;
  offset: NonNegativeInt;
}

model EventTypeListResponse {
  items: EventType[];
}

model SlotListResponse {
  items: Slot[];
  meta: PaginatedMeta;
}

model BookingListResponse {
  items: Booking[];
  meta: PaginatedMeta;
}

// ═════════════════════════════════════════════
// Errors
// ═════════════════════════════════════════════

model ErrorResponse {
  code: NonEmptyString;
  message: NonEmptyString;
}

model ConflictErrorResponse extends ErrorResponse {
  code: "slot_conflict";
}

model NotFoundErrorResponse extends ErrorResponse {
  code: "not_found";
}

model ValidationErrorResponse extends ErrorResponse {
  code: "validation_error";
}

// ═════════════════════════════════════════════
// Owner API
// ═════════════════════════════════════════════

@tag("Owner")
interface OwnerApi {
  /** Получить профиль владельца календаря. */
  @get
  @route("/owner")
  getOwner(): Owner;

  /** Создать тип события. */
  @post
  @route("/owner/event-types")
  createEventType(
    @body body: EventTypeCreateInput
  ): {
    @statusCode statusCode: 201;
    @body eventType: EventType;
  } | {
    @statusCode statusCode: 400;
    @body error: ValidationErrorResponse;
  };

  /** Обновить тип события (partial update). */
  @patch
  @route("/owner/event-types/{eventTypeId}")
  updateEventType(
    @path eventTypeId: string,
    @body body: EventTypeUpdateInput
  ): EventType | {
    @statusCode statusCode: 404;
    @body error: NotFoundErrorResponse;
  } | {
    @statusCode statusCode: 400;
    @body error: ValidationErrorResponse;
  };

  /** Список типов событий владельца. */
  @get
  @route("/owner/event-types")
  listOwnerEventTypes(): EventTypeListResponse;

  /** Предстоящие бронирования всех типов событий. */
  @get
  @route("/owner/bookings")
  listUpcomingBookings(
    @query from?: UtcDateTime,
    @query limit?: PositiveInt,
    @query offset?: NonNegativeInt
  ): BookingListResponse;

  /** Получить детали одного бронирования. */
  @get
  @route("/owner/bookings/{bookingId}")
  getBookingById(
    @path bookingId: string
  ): Booking | {
    @statusCode statusCode: 404;
    @body error: NotFoundErrorResponse;
  };

  /** Отменить бронирование (владелец). */
  @post
  @route("/owner/bookings/{bookingId}/cancel")
  cancelBooking(
    @path bookingId: string
  ): Booking | {
    @statusCode statusCode: 404;
    @body error: NotFoundErrorResponse;
  };
}

// ═════════════════════════════════════════════
// Public guest API
// ═════════════════════════════════════════════

@tag("Public")
interface PublicApi {
  /** Публичный список доступных типов событий. */
  @get
  @route("/public/event-types")
  listPublicEventTypes(): EventTypeListResponse;

  /**
   * Слоты для выбранного типа события в заданном диапазоне.
   * Правило занятости общее для всего календаря.
   * timezone — IANA timezone гостя, используется для группировки слотов по дням.
   */
  @get
  @route("/public/event-types/{eventTypeId}/slots")
  listAvailableSlots(
    @path eventTypeId: string,
    @query from: UtcDateTime,
    @query to: UtcDateTime,
    @query timezone?: NonEmptyString,
    @query limit?: PositiveInt,
    @query offset?: NonNegativeInt
  ): SlotListResponse | {
    @statusCode statusCode: 404;
    @body error: NotFoundErrorResponse;
  } | {
    @statusCode statusCode: 400;
    @body error: ValidationErrorResponse;
  };

  /**
   * Создать бронирование.
   * endAt вычисляется сервером по durationMinutes выбранного event type.
   * 409 если интервал пересекается с существующим бронированием
   * (даже другого типа события).
   */
  @post
  @route("/public/bookings")
  createBooking(
    @body body: BookingCreateInput
  ): {
    @statusCode statusCode: 201;
    @body response: GuestBookingCreatedResponse;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundErrorResponse;
  } | {
    @statusCode statusCode: 400;
    @body error: ValidationErrorResponse;
  } | {
    @statusCode statusCode: 409;
    @body error: ConflictErrorResponse;
  };

  /** Получить бронирование гостя по токену. */
  @get
  @route("/public/bookings/by-token/{guestCancelToken}")
  getBookingByGuestToken(
    @path guestCancelToken: NonEmptyString
  ): GuestBooking | {
    @statusCode statusCode: 404;
    @body error: NotFoundErrorResponse;
  };

  /** Отменить бронирование гостя по токену. */
  @post
  @route("/public/bookings/by-token/{guestCancelToken}/cancel")
  cancelBookingByGuestToken(
    @path guestCancelToken: NonEmptyString
  ): GuestBooking | {
    @statusCode statusCode: 404;
    @body error: NotFoundErrorResponse;
  };
}

// ═════════════════════════════════════════════
// Constraint documentation
// ═════════════════════════════════════════════

@doc("""
Правило занятости слота:

Нельзя создать два активных бронирования на пересекающиеся интервалы,
даже если они относятся к разным типам событий.

Конфликт определяется как:
  existing.startAt < new.endAt AND existing.endAt > new.startAt

Примеры:
  10:00–10:30 и 10:00–10:30 → конфликт
  10:00–10:30 и 10:15–10:45 → конфликт
  10:00–10:30 и 10:30–11:00 → допустимо (смежные, не пересекаются)

При проверке конфликтов учитываются только бронирования со статусом "active".
""")
model BookingConflictRuleDoc {}

@doc("""
Правило вычисления endAt:

Клиент передает только startAt и eventTypeId.
Сервер обязан:
  1. загрузить EventType,
  2. взять durationMinutes,
  3. вычислить endAt = startAt + durationMinutes.

Клиент не может передавать endAt при создании бронирования.
""")
model BookingEndAtComputationDoc {}

@doc("""
Правило гостевого доступа:

Для каждого созданного бронирования сервер генерирует guestCancelToken.

Токен позволяет гостю:
  - получить свое бронирование,
  - отменить свое бронирование,

без регистрации и авторизации.

В рамках учебного проекта guestCancelToken может возвращаться
прямо в ответе на создание бронирования.
""")
model GuestCancelTokenRuleDoc {}
