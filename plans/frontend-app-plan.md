# План разработки Frontend-приложения (AI-агент)

**Контекст:**
Разработка SPA для сервиса бронирования календаря. Авторизации нет. Роли: Владелец и Гость.

**Стек:**
- **React 19**, **TypeScript**, **Vite 8**
- UI: **Mantine** (v9+)
- Стейт: **TanStack Query v5**
- Роутинг: **React Router v7**

---

## Шаг 1: Инициализация и Mantine
**Задача:** Базовая настройка проекта.

1. Инициализация в директории `frontend/`.
2. Установка Mantine: `@mantine/core`, `@mantine/hooks`, `@mantine/dates`, `@mantine/notifications`.
3. Настройка Vite: `server.host: true` для Docker.
4. Настройка `MantineProvider`.

## Шаг 2: Маршрутизация и Layouts
**Задача:** Роли и страницы.

1. `RootLayout` с навигацией.
2. Роуты Владельца (`/owner/*`):
   - `/owner/event-types`: Список и модалка создания.
   - `/owner/bookings`: Просмотр бронирований.
3. Роуты Гостя:
   - `/`: Главная со списком.
   - `/book/:eventTypeId`: Выбор слота.

## Шаг 3: Слой API (TanStack Query)
**Задача:** Хуки данных по `calendar.tsp`.

1. Настройка Axios/Fetch к `http://localhost:4010`.
2. Типизация: `EventType`, `Slot`, `Booking`.
3. Хуки: `usePublicEventTypes`, `useAvailableSlots`, `useCreateBooking`.
4. Хуки: `useOwnerEventTypes`, `useUpcomingBookings`, `useCancelBooking`.

## Шаг 4: Реализация страниц
**Задача:** UI и формы.

1. **Владелец:** Форма создания типа события (Mantine `Modal`, `TextInput`, `NumberInput`). Список предстоящих встреч с кнопкой отмены.
2. **Гость:** Список карточек событий. Страница выбора даты (Mantine `DatePicker`) и сетка слотов. Форма бронирования (Имя, Email).
3. **Уведомления:** Показ ошибок (409 конфликт) и успеха через `notifications.show`.

## Шаг 5: Проверка и полировка
**Задача:** Валидация.

1. Проверка адаптивности.
2. Состояния загрузки (`Loader`).
3. Тестирование флоу бронирования и отмены.
