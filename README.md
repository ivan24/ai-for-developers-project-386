# ai-for-developers-project-386
# Book a Call

Учебный проект Hexlet для сервиса бронирования встреч.

## Команды

- `make generate-openapi` — сгенерировать `docs/openapi.yaml` из `docs/calendar.tsp`
- `make up` — сгенерировать `OpenAPI` и поднять `frontend`, `backend`, `backend-web` и `db`
- `make down` — остановить контейнеры
- `make logs` — посмотреть логи сервисов
- `make frontend-install` — установить frontend-зависимости в контейнере
- `make backend-install` — установить backend-зависимости в контейнере
- `make backend-key` — сгенерировать `APP_KEY` для Laravel
- `make migrate` — выполнить Laravel migrations
- `make infra-check` — прогнать базовую проверку инфраструктуры
- `make prod-build` — собрать production Docker-образ из корневого `Dockerfile`
- `make prod-smoke` — запустить production Docker-образ против локальной dev-базы и проверить `health` и публичный API
- `make e2e` — прогнать основной сценарий бронирования через Playwright на test DB
- `make e2e-up` — переключить текущий backend на test DB для e2e-отладки
- `make e2e-down` — вернуть backend на обычную dev DB и убрать временную e2e DB
- `make ci` — прогнать backend QA, frontend build и Playwright e2e в той же последовательности, что и GitHub Actions
- `make e2e` временно пересоздаёт `frontend`, `backend` и `backend-web`, запускает сценарий на отдельной `bookacall_e2e` БД, а затем возвращает обычный dev-стек.
- Первый `make e2e` может дополнительно скачать Playwright image; последующие прогоны его переиспользуют.

## CI

В репозитории добавлен workflow `.github/workflows/tests.yml`.
Он запускается на `push` и `pull_request`, использует `make ci` и при падении прикладывает `frontend/playwright-report` и `frontend/test-results` как артефакты GitHub Actions.

## Production deploy

- Production-сборка выполняется корневым `Dockerfile`.
- Контейнер стартует автоматически и слушает порт из переменной окружения `PORT`.
- Для Render добавлен blueprint в `render.yaml`: web service на Docker и отдельная Postgres база.
- После ручного деплоя добавьте сюда публичную ссылку на приложение.
