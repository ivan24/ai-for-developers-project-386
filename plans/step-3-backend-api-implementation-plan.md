# План реализации backend API

## Summary

Реализовать весь контракт из `docs/calendar.tsp` на Laravel 13 с PostgreSQL. Архитектура backend: тонкие контроллеры, бизнес-логика в сервисах, доступ к данным только через repository-классы, Eloquent-модели без доменной логики.

Первый этап покрывает все `Owner` и `Public` endpoint-ы из спеки, включая guest token сценарии, `PATCH` event type и detail endpoint-ы бронирований. HTTP-контракт сохраняется без `/api` префикса, чтобы не расходиться с текущими `TypeSpec`, `OpenAPI` и фронтендом.

## Implementation Changes

### Домен и хранение данных

- Добавить persisted-модели:
  - `Owner`: `id`, `name`, `timezone`, timestamps
  - `EventType`: `id`, `name`, `description`, `duration_minutes`, timestamps
  - `Booking`: `id`, `event_type_id`, `start_at`, `end_at`, `guest_name`, `guest_email`, `guest_cancel_token`, `status`, `created_at`, `updated_at`
- `Slot` не хранить в БД: это вычисляемое представление для `GET /public/event-types/{eventTypeId}/slots`.
- Использовать ULID string id для `owners`, `event_types`, `bookings`.
- В `bookings` добавить индексы:
  - `event_type_id`
  - уникальный `guest_cancel_token`
  - `start_at`
  - составной `status, start_at`
- Конфликт бронирования проверять в сервисе в транзакции по правилу:
  - `existing.start_at < new_end_at AND existing.end_at > new_start_at`
  - учитываются только `active` bookings

### Слои приложения

- Контроллеры только:
  - принимают request
  - валидируют через Form Request
  - вызывают сервис
  - возвращают JSON в shape контракта
- Form Requests:
  - create/update event type
  - list bookings
  - list slots
  - create booking
- Repository-классы:
  - `OwnerRepository`
  - `EventTypeRepository`
  - `BookingRepository`
- Все чтение и запись из сервисов идут только через repositories; прямые запросы в сервисах не используются.
- Сервисы сгруппировать по домену:
  - `OwnerService`
    - `getProfile()`
  - `EventTypeService`
    - `create()`
    - `update()`
    - `listOwnerEventTypes()`
    - `listPublicEventTypes()`
  - `BookingService`
    - `listUpcoming()`
    - `getById()`
    - `getByGuestToken()`
    - `listAvailableSlots()`
    - `create()`
    - `cancelByOwner()`
    - `cancelByGuestToken()`
- Eloquent-модели оставить "тупыми": `fillable`, `casts`, relations, table metadata; без бизнес-методов.

### HTTP контракт

- Реализовать routes без `/api` prefix:
  - `GET /owner`
  - `POST /owner/event-types`
  - `PATCH /owner/event-types/{eventTypeId}`
  - `GET /owner/event-types`
  - `GET /owner/bookings`
  - `GET /owner/bookings/{bookingId}`
  - `POST /owner/bookings/{bookingId}/cancel`
  - `GET /public/event-types`
  - `GET /public/event-types/{eventTypeId}/slots`
  - `POST /public/bookings`
  - `GET /public/bookings/by-token/{guestCancelToken}`
  - `POST /public/bookings/by-token/{guestCancelToken}/cancel`
- Ответы держать совместимыми с `docs/openapi.yaml`:
  - `POST /owner/event-types` возвращает `EventType`
  - `POST /public/bookings` возвращает `{ booking: GuestBooking }`
  - ошибки возвращают `{ code, message }` с кодами `validation_error | not_found | slot_conflict`
- Для списков всегда возвращать `items` и `meta.total`, `meta.limit`, `meta.offset`.

### Генерация слотов

- Базовое расписание owner: ежедневно `09:00-18:00` в timezone владельца.
- Timezone владельца в seed: `UTC`.
- Шаг слотов равен `durationMinutes` выбранного event type.
- Алгоритм:
  - взять `from/to`
  - интерпретировать диапазон относительно timezone владельца
  - сгенерировать candidate starts внутри рабочего окна
  - вычислить `endAt = startAt + duration`
  - отбросить слоты вне диапазона и рабочего окна
  - пометить `isAvailable` по отсутствию конфликтующего `active` booking
  - применить `offset/limit`
- `timezone` гостя использовать только как входной контекст диапазона; persisted времена хранить в UTC.

### Seeds и workflow

- Добавить расширенный demo seed:
  - 1 owner c timezone `UTC`
  - 3-5 event types разной длительности
  - future/past, active/cancelled bookings
  - минимум один booking, который блокирует доступный слот
- Seed должен покрывать ручную проверку owner/public flow и guest token endpoint-ов.
- Добавить make targets для проверки backend:
  - `make backend-test`
  - `make seed` или `make migrate-seed`

## Public Interfaces / Types

- Публичный HTTP-контракт остается как в `TypeSpec/OpenAPI`, без `/api` префикса.
- Внутренние backend интерфейсы:
  - repository interfaces для owner/event type/booking
  - service input DTO или typed arrays на границе use-case
- Persisted enum/constant:
  - `BookingStatus = active | cancelled`

## Test Plan

- Feature tests на каждый endpoint:
  - успешные `GET/POST/PATCH`
  - `404` для несуществующих `eventTypeId`, `bookingId`, `guestCancelToken`
  - `400` для невалидных body/query params
  - `409` при конфликте слотов
- Сценарии бизнес-правил:
  - два пересекающихся active booking не создаются
  - смежные интервалы допустимы
  - cancelled booking не блокирует слот
  - `endAt` считается сервером по `durationMinutes`
  - owner cancel и guest cancel меняют статус на `cancelled`
  - повторная отмена возвращает текущее `cancelled` бронирование
- Проверка slot generation:
  - слоты только в окне `09:00-18:00`
  - шаг равен длительности event type
  - занятый слот возвращается с `isAvailable=false`
  - пагинация применяется корректно
- Verification через `make`:
  - `make migrate`
  - make target для seed
  - `make backend-test`

## Assumptions

- Backend реализуется целиком по всей спеке, не только под текущий UI.
- Owner хранится в таблице `owners`, а не в `users`.
- `Slot` не имеет собственной таблицы.
- Значения по умолчанию для пагинации:
  - `limit = 20`
  - `offset = 0`
- Повторная отмена считается идемпотентной.
- Пустое `description` нормализуется в `null`.
