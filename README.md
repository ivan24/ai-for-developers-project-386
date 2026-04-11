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
- `make e2e` — прогнать основной сценарий бронирования через Playwright на test DB
- `make e2e-up` — переключить текущий backend на test DB для e2e-отладки
- `make e2e-down` — вернуть backend на обычную dev DB и убрать временную e2e DB
- `make e2e` временно пересоздаёт `frontend`, `backend` и `backend-web`, запускает сценарий на отдельной `bookacall_e2e` БД, а затем возвращает обычный dev-стек.
- Первый `make e2e` может дополнительно скачать Playwright image; последующие прогоны его переиспользуют.
