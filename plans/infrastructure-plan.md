# План подготовки инфраструктуры (AI-агент)

**Контекст задачи:**
Настроить контейнеризацию и окружение разработки для сервиса бронирования. Источник истины для API-контракта: `docs/calendar.tsp`. Мок-сервер должен работать по сгенерированному `OpenAPI`, а не читать `.tsp` напрямую.

**Технологический стек (2026):**
- Инфраструктура: **Docker**, **Docker Compose**
- Управление: **Make**
- Контракт API: **TypeSpec**
- Генерация спецификации: **@typespec/compiler** + **@typespec/openapi3**
- Мок-сервер API: **Prism**

**Принцип разделения ответственности:**
- `TypeSpec compiler` с emitter'ом `@typespec/openapi3` компилирует `docs/calendar.tsp` в `docs/openapi.yaml`
- `Prism` запускает mock API по готовому `docs/openapi.yaml`
- генерация `OpenAPI` выполняется отдельным одноразовым контейнером
- runtime-контейнер `api-mock` содержит только `Prism`

---

## Шаг 1: Настройка Docker
**Задача:** Разделить генерацию `OpenAPI` и запуск mock API.

1. Создать папку `docker/` в корне проекта.
2. Создать `docker/frontend/Dockerfile`:
   - базовый образ Node.js 24+ для разработки через Vite
   - рабочая директория `/app`
   - конфигурация должна подходить для разработки с mounted volume
3. Создать `docker/openapi-generator/Dockerfile`:
   - отдельный образ только для генерации `OpenAPI`
   - установить `@typespec/compiler` и `@typespec/openapi3`
   - рабочая директория `/app`
   - контейнер должен уметь брать `docs/calendar.tsp` и генерировать `docs/openapi.yaml`
4. Создать `docker/api-mock/Dockerfile`:
   - отдельный runtime-образ только для mock API
   - установить `Prism`
   - контейнер должен запускать `prism mock -h 0.0.0.0 /app/docs/openapi.yaml`

## Шаг 2: Генерация OpenAPI
**Задача:** Сделать `openapi.yaml` явным артефактом проекта.

1. Генерировать `docs/openapi.yaml` из `docs/calendar.tsp`.
2. Считать `docs/openapi.yaml` частью репозитория и коммитить его в git.
3. Генерация должна запускаться через отдельную команду `make generate-openapi`.
4. Команда генерации должна использовать одноразовый generator-контейнер, чтобы не требовать локальной установки `TypeSpec` на хост-машине.
5. При повторном запуске `make generate-openapi` файл `docs/openapi.yaml` должен пересоздаваться или обновляться из текущего состояния `docs/calendar.tsp`.

## Шаг 3: Настройка Docker Compose
**Задача:** Поднять только runtime-сервисы разработки.

1. Создать `docker-compose.yml` в корне проекта.
2. Добавить сервис `frontend`:
   - порт `5173`
   - volume `./frontend:/app`
   - использовать `docker/frontend/Dockerfile`
3. Добавить сервис `api-mock`:
   - порт `4010`
   - использовать `docker/api-mock/Dockerfile`
   - монтировать `./docs:/app/docs`
   - читать готовый `docs/openapi.yaml`
4. Не добавлять generator как постоянно работающий сервис в `docker-compose.yml`.

## Шаг 4: Настройка Makefile
**Задача:** Сделать генерацию и запуск среды явными и воспроизводимыми.

1. Создать `Makefile` с `help` как действием по умолчанию.
2. Добавить секцию `OpenAPI`:
   - `generate-openapi` — запуск одноразового generator-контейнера и генерация `docs/openapi.yaml`
3. Добавить секцию `Docker`:
   - `up` — сначала `generate-openapi`, затем `docker compose up -d --build`
   - `down` — остановка контейнеров
   - `logs` — просмотр логов сервисов
   - `ps` — список контейнеров
4. Добавить секцию `App`:
   - `sh-frontend` — вход в shell контейнера фронтенда

## Шаг 5: Проверка
**Задача:** Подтвердить, что пайплайн `TypeSpec -> OpenAPI -> Prism` работает.

1. `make generate-openapi` создает `docs/openapi.yaml`.
2. После изменения `docs/calendar.tsp` повторный `make generate-openapi` обновляет `docs/openapi.yaml`.
3. `make up` поднимает `frontend` и `api-mock` без ручных дополнительных шагов.
4. `api-mock` стартует на порту `4010` и читает именно `docs/openapi.yaml`.
5. Мок-сервер отвечает хотя бы на один endpoint из контракта, например `/public/event-types`.
