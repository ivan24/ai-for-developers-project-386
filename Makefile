COMPOSE = docker compose
TOOLING_RUN = $(COMPOSE) run --rm tooling sh -lc
REQUIRE_DEPS = test -d node_modules && test -d frontend/node_modules && test -d packages/api-client/node_modules || (echo 'Dependencies are not installed in Docker volumes. Run make install first.' >&2; exit 1)
DOCKER_READY = docker info >/dev/null 2>&1 || (echo 'Docker daemon is not running. Start Docker Desktop or the Docker service first.' >&2; exit 1)

.PHONY: check-docker install up down logs dev gen-openapi gen-api typecheck test build lint sh-frontend

check-docker:
	@$(DOCKER_READY)

install: check-docker
	$(TOOLING_RUN) "corepack pnpm install"

gen-openapi: check-docker install
	$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run gen-openapi"

gen-api: gen-openapi
	$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run gen-api"

up: check-docker install gen-api
	$(COMPOSE) up -d --build frontend api-mock

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

dev: check-docker install gen-api
	$(COMPOSE) up --build frontend api-mock

typecheck: check-docker gen-api
	$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run typecheck"

test: check-docker gen-api
	$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run test"

build: check-docker gen-api
	$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run build"

lint: check-docker install
	$(TOOLING_RUN) "$(REQUIRE_DEPS); corepack pnpm run lint"

sh-frontend: check-docker
	$(COMPOSE) exec frontend sh
