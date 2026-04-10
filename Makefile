.DEFAULT_GOAL := help

PROJECT_NAME            := ai-for-developers
DOCKER_COMPOSE          := docker compose
DOCKER_EXEC             := $(DOCKER_COMPOSE) exec -T
DOCKER_RUN              := $(DOCKER_COMPOSE) run --rm
OPENAPI_GENERATOR_IMAGE := $(PROJECT_NAME)-openapi-generator
HOST_UID                := $(shell id -u)
HOST_GID                := $(shell id -g)

.PHONY: help generate-openapi up down logs ps frontend-install backend-install backend-composer-refresh backend-composer-update backend-key migrate seed migrate-seed backend-test infra-check sh-frontend sh-backend

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

infra-check: ## Run a basic infrastructure smoke test
	$(DOCKER_EXEC) db pg_isready -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"
	$(DOCKER_EXEC) backend php artisan route:list --path=health
	$(DOCKER_EXEC) backend php artisan migrate --force --graceful --no-interaction
	$(DOCKER_EXEC) backend-web curl -fsS http://127.0.0.1/up >/dev/null

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
		/^[a-zA-Z_-]+:.*?##/ { \
			printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 \
		} \
		/^##@/ { \
			printf "\n\033[1m%s\033[0m\n", substr($$0, 5) \
		}' $(MAKEFILE_LIST)
