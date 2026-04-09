.DEFAULT_GOAL := help

PROJECT_NAME            := ai-for-developers
DOCKER_COMPOSE          := docker compose
OPENAPI_GENERATOR_IMAGE := $(PROJECT_NAME)-openapi-generator
HOST_UID                := $(shell id -u)
HOST_GID                := $(shell id -g)

.PHONY: help generate-openapi up down logs ps sh-frontend

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

up: generate-openapi ## Generate OpenAPI and start dev containers
	$(DOCKER_COMPOSE) up -d --build

down: ## Stop and remove dev containers
	$(DOCKER_COMPOSE) down

logs: ## Follow service logs
	$(DOCKER_COMPOSE) logs -f --tail=100

ps: ## Show running containers
	$(DOCKER_COMPOSE) ps

##@ App

sh-frontend: ## Open a shell inside the frontend container
	$(DOCKER_COMPOSE) exec frontend sh

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
