.DEFAULT_GOAL := help

PROJECT_NAME            := ai-for-developers
DOCKER_COMPOSE          := docker compose
DOCKER_EXEC             := $(DOCKER_COMPOSE) exec -T
DOCKER_RUN              := $(DOCKER_COMPOSE) run --rm
OPENAPI_GENERATOR_IMAGE := $(PROJECT_NAME)-openapi-generator
HOST_UID                := $(shell id -u)
HOST_GID                := $(shell id -g)
E2E_DB_HOST             := db-e2e
E2E_DB_NAME             := bookacall_e2e
E2E_DB_VOLUME           := $(PROJECT_NAME)_db_e2e_data
E2E_FRONTEND_ORIGIN     := http://localhost:5173

.PHONY: help generate-openapi up down logs ps frontend-install frontend-build backend-install backend-composer-refresh backend-composer-update backend-key migrate seed migrate-seed backend-test backend-lint backend-lint-fix backend-analyse backend-qa infra-check e2e-up e2e-prepare e2e-test e2e-clean-artifacts e2e-reset e2e-down e2e sh-frontend sh-backend

##@ OpenAPI

generate-openapi: ## Generate docs/openapi.yaml from docs/calendar.tsp
	docker build \
		--file docker/openapi-generator/Dockerfile \
		--tag $(OPENAPI_GENERATOR_IMAGE) \
		.
	docker run --rm \
		--user $(HOST_UID):$(HOST_GID) \
		--volume $(CURDIR):/workspace/project \
		$(OPENAPI_GENERATOR_IMAGE)

##@ Docker

up: frontend-install backend-install ## Start dev containers
	$(DOCKER_COMPOSE) up -d --build --remove-orphans

down: ## Stop and remove dev containers
	$(DOCKER_COMPOSE) down --remove-orphans

logs: ## Follow service logs
	$(DOCKER_COMPOSE) logs -f --tail=100

ps: ## Show running containers
	$(DOCKER_COMPOSE) ps

##@ App

frontend-install: ## Install frontend dependencies inside the frontend container
	$(DOCKER_RUN) --no-deps frontend npm install

frontend-build: ## Run frontend typecheck and production build inside the frontend container
	$(DOCKER_EXEC) frontend npm run build

backend-install: ## Install backend dependencies inside the backend container
	$(DOCKER_RUN) --build --no-deps backend sh -lc 'if [ ! -f .env ]; then cp .env.example .env; fi && composer install --no-interaction'

backend-composer-refresh: ## Refresh backend composer.lock inside the backend container
	$(DOCKER_RUN) --build --no-deps backend sh -lc 'if [ ! -f .env ]; then cp .env.example .env; fi && composer update --lock --no-interaction'

backend-composer-update: ## Update backend composer.lock and install the current dependency set inside the backend container
	$(DOCKER_RUN) --build --no-deps backend sh -lc 'if [ ! -f .env ]; then cp .env.example .env; fi && composer update --with-all-dependencies --no-interaction'

backend-key: ## Generate APP_KEY inside the backend container
	$(DOCKER_EXEC) backend php artisan key:generate --force --no-interaction

migrate: ## Run Laravel migrations inside the backend container
	$(DOCKER_EXEC) backend php artisan migrate --force --no-interaction

seed: ## Run Laravel seeders inside the backend container
	$(DOCKER_EXEC) backend php artisan db:seed --force --no-interaction

migrate-seed: ## Refresh the database and seed demo data inside the backend container
	$(DOCKER_EXEC) backend php artisan migrate:fresh --seed --force --no-interaction

backend-test: ## Run backend test suite inside the backend container
	$(DOCKER_EXEC) backend php artisan test --without-tty

backend-lint: ## Check backend formatting with Pint
	$(DOCKER_EXEC) backend ./vendor/bin/pint --test

backend-lint-fix: ## Fix backend formatting with Pint
	$(DOCKER_EXEC) backend ./vendor/bin/pint

backend-analyse: ## Run Larastan static analysis inside the backend container
	$(DOCKER_EXEC) backend ./vendor/bin/phpstan analyse --memory-limit=512M

backend-qa: backend-lint backend-analyse backend-test ## Run backend QA checks

infra-check: ## Run a basic infrastructure smoke test
	$(DOCKER_EXEC) db pg_isready -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"
	$(DOCKER_EXEC) backend php artisan route:list --path=health
	$(DOCKER_EXEC) backend php artisan migrate --force --graceful --no-interaction
	$(DOCKER_EXEC) backend-web curl -fsS http://127.0.0.1/up >/dev/null

e2e-up: frontend-install backend-install ## Recreate the current app stack against the e2e database
	BACKEND_DB_HOST=$(E2E_DB_HOST) \
	BACKEND_DB_DATABASE=$(E2E_DB_NAME) \
	E2E_POSTGRES_DB=$(E2E_DB_NAME) \
	FRONTEND_URL=$(E2E_FRONTEND_ORIGIN) \
	CORS_ALLOWED_ORIGINS=$(E2E_FRONTEND_ORIGIN) \
	$(DOCKER_COMPOSE) up -d --build --force-recreate --remove-orphans frontend backend backend-web db db-e2e

e2e-prepare: ## Refresh the e2e database with deterministic booking fixtures
	$(DOCKER_EXEC) backend php artisan migrate:fresh --seed --seeder=Database\\Seeders\\E2eBookingSeeder --force --no-interaction

e2e-test: ## Run Playwright booking tests against the current frontend service
	$(DOCKER_RUN) --no-deps playwright npm run test:e2e

e2e-clean-artifacts: ## Remove Playwright artifacts after a successful e2e run
	rm -rf frontend/test-results frontend/playwright-report

e2e-reset: ## Restore the default backend database wiring after e2e runs
	$(DOCKER_COMPOSE) up -d --build --force-recreate backend backend-web frontend db

e2e-down: e2e-reset ## Remove the temporary e2e database service
	$(DOCKER_COMPOSE) rm -sf db-e2e
	docker volume rm -f $(E2E_DB_VOLUME) >/dev/null 2>&1 || true

e2e: ## Run the main booking flow end-to-end with Playwright
	@set -eu; \
	trap 'status=$$?; $(MAKE) e2e-down; exit $$status' EXIT INT TERM; \
	$(MAKE) e2e-up; \
	$(MAKE) e2e-prepare; \
	$(MAKE) e2e-test; \
	$(MAKE) e2e-clean-artifacts

sh-frontend: ## Open a shell inside the frontend container
	$(DOCKER_COMPOSE) exec frontend sh

sh-backend: ## Open a shell inside the backend container
	$(DOCKER_COMPOSE) exec backend sh

##@ Help

help: ## Show this help message
	@awk ' \
		BEGIN { \
			FS = ":.*##"; \
			printf "\nUsage:\n  make \033[36m<target>\033[0m\n" \
		} \
		/^[a-zA-Z0-9_-]+:.*?##/ { \
			printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 \
		} \
		/^##@/ { \
			printf "\n\033[1m%s\033[0m\n", substr($$0, 5) \
		}' $(MAKEFILE_LIST)
