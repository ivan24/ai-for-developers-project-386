# План инфраструктуры backend (Laravel 13 + PostgreSQL 18)

**Контекст задачи:**
Заменить текущий `api-mock` на реальный backend-слой, но пока только на уровне инфраструктуры. Бизнес-логика, доменные endpoint-ы и прикладная реализация API в этот этап не входят. Источник истины для контракта пока остается в `docs/calendar.tsp` и `docs/openapi.yaml`.

**Технологический стек (2026):**
- Backend framework: **Laravel 13**
- Runtime: **PHP-FPM + Nginx**
- База данных: **PostgreSQL 18.3**
- Инфраструктура: **Docker**, **Docker Compose**
- Управление: **Make**
- Frontend: существующий **Vite + React**

**Принципы этапа:**
- реализуется только инфраструктурный контур backend
- backend должен запускаться локально в compose-окружении вместе с frontend
- все рабочие команды проекта должны идти через `make`
- инфраструктура должна быть пригодна для локальной разработки и подготовлена к будущему deploy на обычный Docker-host
- дополнительные сервисы вроде Redis, Mailpit, workers и scheduler на этом этапе не добавляются

---

## Шаг 1: Новая контейнерная схема
**Задача:** Убрать mock API из runtime-среды и ввести реальный backend-контур.

1. Удалить сервис `api-mock` из `docker-compose.yml`.
2. Добавить сервис `backend`:
   - Laravel application container
   - runtime на `php-fpm`
   - mounted volume с кодом backend для локальной разработки
3. Добавить сервис `backend-web`:
   - отдельный `nginx`
   - проксирование запросов в `backend`
   - публичный порт для локального API, например `8080`
4. Добавить сервис `db`:
   - образ `postgres:18`
   - отдельный named volume для данных
   - healthcheck на готовность PostgreSQL
5. Оставить сервис `frontend`, но переключить его на работу с реальным backend вместо mock API.

## Шаг 2: Docker-образы backend
**Задача:** Подготовить контейнеры Laravel runtime и веб-сервера.

1. Создать `docker/backend/Dockerfile`:
   - PHP-образ для Laravel 13
   - установить необходимые расширения для PostgreSQL и Laravel:
     - `pdo_pgsql`
     - `pgsql`
     - `mbstring`
     - `intl`
     - `bcmath`
     - `zip`
     - `opcache`
   - установить Composer 2.9.5
   - рабочая директория для backend-приложения
2. Создать `docker/backend-web/Dockerfile`:
   - образ `nginx`
   - конфиг для обслуживания Laravel из `public/`
   - `try_files` и проксирование PHP-запросов в `php-fpm`
3. Создать конфиг `nginx` для backend:
   - входная точка `public/index.php`
   - корректная работа с Laravel routing
   - базовые заголовки и безопасные дефолты без production-усложнений

## Шаг 3: Каркас Laravel-приложения
**Задача:** Добавить backend skeleton без реализации предметной логики.

1. Создать директорию `backend/` как корень Laravel 13 приложения.
2. Подготовить базовую Laravel-структуру:
   - `artisan`
   - `bootstrap/`
   - `config/`
   - `public/`
   - `routes/`
   - `storage/`
   - `database/`
3. Настроить `.env.example` для Laravel:
   - `APP_ENV`
   - `APP_DEBUG`
   - `APP_URL`
   - `DB_CONNECTION=pgsql`
   - `DB_HOST=db`
   - `DB_PORT=5432`
   - `DB_DATABASE`
   - `DB_USERNAME`
   - `DB_PASSWORD`
4. Добавить минимальный health endpoint:
   - `/up` или `/health`
   - endpoint нужен только для проверки готовности контейнера и compose healthcheck
5. Не реализовывать пока owner/public API маршруты из `TypeSpec`.

## Шаг 4: Compose и конфигурация окружения
**Задача:** Связать frontend, backend и PostgreSQL в одно локальное окружение.

1. Обновить `docker-compose.yml`:
   - `frontend`
   - `backend`
   - `backend-web`
   - `db`
2. Настроить зависимости сервисов:
   - `backend` зависит от готовности `db`
   - `backend-web` зависит от `backend`
   - `frontend` использует backend URL нового API
3. Обновить frontend-конфигурацию API:
   - убрать привязку к `http://localhost:4010`
   - использовать `VITE_API_BASE_URL`
   - локальный дефолт должен указывать на реальный backend, например `http://localhost:8080`
4. Подготовить корневой `.env.example` для compose-переменных, если они нужны на уровне всей среды.

## Шаг 5: Make-based workflow
**Задача:** Сохранить единый способ управления проектом через `make`.

1. Обновить `Makefile`, чтобы он управлял новой backend-инфраструктурой.
2. Сохранить существующие команды:
   - `make up`
   - `make down`
   - `make logs`
   - `make ps`
3. Добавить backend-команды:
   - `make frontend-install` — установка frontend-зависимостей
   - `make sh-backend` — shell внутри backend-контейнера
   - `make backend-install` — установка backend-зависимостей
   - `make backend-key` — генерация `APP_KEY`
   - `make migrate` — запуск Laravel migrations
   - `make infra-check` — базовая проверка инфраструктурного контура
4. Не использовать прямые host-команды вроде `php artisan`, `composer`, `docker compose` или `npm` вне `make`.

## Шаг 6: Проверка инфраструктуры
**Задача:** Подтвердить, что backend-контур готов к следующему этапу разработки.

1. `make up` поднимает `frontend`, `backend`, `backend-web` и `db`.
2. `backend-web` отвечает на health endpoint.
3. Laravel-контейнер успешно стартует с подключением к PostgreSQL 18.
4. `make migrate` проходит на пустой базе.
5. Frontend ходит в реальный backend URL, а не в `api-mock`.
6. После перезапуска compose данные PostgreSQL сохраняются в volume.
7. В репозитории не остается runtime-зависимости от `Prism` для локальной разработки.

## Шаг 7: Границы этапа
**Задача:** Не смешивать инфраструктуру и реализацию backend-фич.

1. В этот этап не входят:
   - реализация endpoint-ов из `OpenAPI`
   - auth
   - бизнес-правила бронирования
   - slot generation
   - Redis
   - очереди и scheduler
   - production deploy scripts
2. Следующий этап после этого плана:
   - связать Laravel routes/controllers с текущим контрактом из `docs/calendar.tsp`
   - начать перенос поведения с mock API на реальную доменную реализацию
