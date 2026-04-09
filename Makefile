.DEFAULT_GOAL := help

COMPOSE = docker compose
TOOLING_RUN = $(COMPOSE) run --rm tooling sh -lc
REQUIRE_DEPS = test -d node_modules && test -d frontend/node_modules && test -d packages/api-client/node_modules || (echo 'Dependencies are not installed in Docker volumes. Run make install first.' >&2; exit 1)
DOCKER_READY = docker info >/dev/null 2>&1 || (echo 'Docker daemon is not running. Start Docker Desktop or the Docker service first.' >&2; exit 1)

BLUE := \033[1;34m
CYAN := \033[1;36m
GREEN := \033[1;32m
YELLOW := \033[1;33m
RESET := \033[0m

define print_header
	@printf "\n$(BLUE)==>$(RESET) $(CYAN)%s$(RESET)\n" "$(1)"
endef

define print_success
	@printf "$(GREEN)✓$(RESET) %s\n" "$(1)"
endef

.PHONY: help check-docker install up down logs dev gen-openapi gen-api typecheck test build lint sh-frontend

help: ## Show available commands
	@printf "\n$(CYAN)Booking App Make Commands$(RESET)\n"
	@printf "$(YELLOW)Usage:$(RESET) make $(GREEN)<command>$(RESET)\n\n"
	@awk '\
		BEGIN {FS = ":.*## "} \
		/^##@/ {printf "$(BLUE)%s$(RESET)\n", substr($$0, 5); next} \
		/^[a-zA-Z0-9_.-]+:.*## / {printf "  $(GREEN)%-14s$(RESET) %s\n", $$1, $$2} \
	' $(MAKEFILE_LIST)
	@printf "\n"

##@ Setup
check-docker: ## Verify Docker daemon is available
	@$(DOCKER_READY)

install: check-docker ## Install workspace dependencies into Docker volumes
	$(call print_header,Installing dependencies in Docker volumes)
	@$(TOOLING_RUN) "corepack pnpm install"
	$(call print_success,Dependencies installed)

##@ Codegen
gen-openapi: check-docker install ## Generate OpenAPI from TypeSpec
	$(call print_header,Generating OpenAPI contract)
	@$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run gen-openapi"
	$(call print_success,OpenAPI contract updated)

gen-api: gen-openapi ## Generate typed API client from OpenAPI
	$(call print_header,Generating typed API client)
	@$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run gen-api"
	$(call print_success,Typed API client updated)

##@ Runtime
up: check-docker install gen-api ## Start frontend and Prism in detached mode
	$(call print_header,Starting frontend and API mock)
	@$(COMPOSE) up -d --build frontend api-mock
	$(call print_success,Services are running in detached mode)

down: ## Stop all running services
	$(call print_header,Stopping services)
	@$(COMPOSE) down
	$(call print_success,Services stopped)

logs: ## Tail service logs
	$(call print_header,Tailing service logs)
	@$(COMPOSE) logs -f

dev: check-docker install gen-api ## Start frontend and Prism in foreground mode
	$(call print_header,Starting development stack)
	@$(COMPOSE) up --build frontend api-mock

##@ Quality
typecheck: check-docker gen-api ## Run TypeScript typecheck inside Docker
	$(call print_header,Running typecheck)
	@$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run typecheck"
	$(call print_success,Typecheck passed)

test: check-docker gen-api ## Run tests inside Docker
	$(call print_header,Running tests)
	@$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run test"
	$(call print_success,Tests passed)

build: check-docker gen-api ## Build frontend inside Docker
	$(call print_header,Building frontend)
	@$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run build"
	$(call print_success,Build completed)

lint: check-docker install ## Run lint inside Docker
	$(call print_header,Running lint)
	@$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run lint"
	$(call print_success,Lint passed)

##@ Debug
sh-frontend: check-docker ## Open a shell in the frontend container
	$(call print_header,Opening shell in frontend container)
	@$(COMPOSE) exec frontend sh
