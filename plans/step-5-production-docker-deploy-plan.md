# Step 5: Production Docker And Render Deploy

## Summary

Подготовить production deployment как отдельный путь поверх текущего dev-стека: добавить root `Dockerfile`, который собирает frontend и backend в один deployable образ, запускает приложение автоматически внутри контейнера и слушает порт из `PORT`. Деплой целить в Render как Docker Web Service с отдельной managed Postgres базой. В репозиторий также добавить `render.yaml`, `.dockerignore` и ссылку на опубликованное приложение в `README.md`.

## Implementation Changes

- Добавить root `Dockerfile` с multi-stage сборкой:
  - `frontend-build`: установить зависимости в `frontend/`, выполнить `npm run build`, получить `frontend/dist`.
  - `backend-build`: установить production-зависимости в `backend/` через `composer install --no-dev --optimize-autoloader`.
  - final stage: runtime-образ с `php-fpm` и `nginx`, в который копируются Laravel backend и собранный frontend.
- Добавить production startup script:
  - подставляет `PORT` в nginx config на старте контейнера;
  - подготавливает `storage` и `bootstrap/cache`;
  - выполняет `php artisan migrate --force`;
  - запускает `php-fpm` и `nginx` автоматически без дополнительных команд.
- Добавить production nginx config:
  - слушает `${PORT}`;
  - отдает собранный frontend;
  - поддерживает history fallback на `index.html` для React Router;
  - проксирует `/owner/*` и `/public/*` в Laravel через FastCGI;
  - сохраняет `/up` и `/health` для health checks.
- Развести UI и API маршруты:
  - owner UI перевести с `/owner/...` на `/dashboard/...`, чтобы production SPA и backend API не конфликтовали на одном домене;
  - API-маршруты `/owner/*` и `/public/*` не менять.
- Добавить `render.yaml`:
  - один Docker web service;
  - одна managed Postgres база;
  - переменные `APP_ENV`, `APP_DEBUG`, `APP_KEY`, `PORT`, `DB_CONNECTION=pgsql`, `DB_URL`, `QUEUE_CONNECTION`;
  - health check на `/up`.
- Добавить `.dockerignore` для исключения dev-артефактов и ускорения сборки.
- Обновить `README.md`:
  - кратко описать прод-сборку и деплой;
  - оставить место под публичную ссылку на Render-приложение.

## Public Interfaces And Runtime Behavior

- Production образ должен собираться командой `docker build` от корня репозитория.
- Контейнер должен стартовать одной командой `docker run` без `docker compose`.
- Контейнер должен слушать только `PORT`, переданный окружением.
- UI и API должны обслуживаться с одного домена:
  - SPA на `/`, `/book/:eventTypeId`, `/dashboard/event-types`, `/dashboard/bookings`;
  - API на `/public/*` и `/owner/*`.
- База в production подключается через `DB_URL` и `DB_CONNECTION=pgsql`.

## Test Plan

- Собрать production-образ локально через `make prod-build`.
- Запустить локально контейнер через `docker run` с `PORT`, `APP_KEY` и production DB env.
- Проверить:
  - `/` открывает SPA;
  - прямой заход на `/dashboard/event-types` не дает `404`;
  - `/public/event-types` отвечает как API;
  - `/up` или `/health` возвращает `200`.
- Прогнать `make backend-test`.
- Прогнать `make frontend-build`.
- После деплоя на Render проверить:
  - сервис поднялся и проходит health check;
  - миграции применены;
  - бронирование работает против Render Postgres;
  - публичная ссылка открывает приложение.

## Assumptions And Defaults

- Целевая платформа: Render Docker Web Service + Render Postgres.
- Для учебного проекта миграции запускаются в startup script контейнера.
- Dev workflow через текущий `docker-compose.yml` и `Makefile` не переделывается.
- `APP_KEY` задается как secret в Render blueprint и приводится к формату Laravel на старте контейнера.
