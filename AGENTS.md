# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Hexlet учебный проект for a Cal.com-like booking app.

- `backend/` — Laravel 13 API backend.
- `backend/app/Services/` — business use-case logic.
- `backend/app/Repositories/` — data access layer for models.
- `backend/routes/api.php` — JSON API routes for owner/public flows.
- `backend/database/migrations/` and `backend/database/seeders/` — schema and demo data.
- `frontend/` — Vite + React + TypeScript client.
- `frontend/src/pages/` — route-level screens such as `HomePage.tsx` and `BookEventPage.tsx`.
- `frontend/src/components/` — shared UI and layout components.
- `frontend/src/api/` — API client, React Query hooks, and shared types.
- `docs/` — TypeSpec source (`calendar.tsp`) and generated OpenAPI output (`openapi.yaml`).
- `docker/` and `docker-compose.yml` — local containers for frontend, backend, backend-web, and PostgreSQL.
- `plans/` — implementation plans and task notes.

## Build, Test, and Development Commands

- `make up` — install app dependencies in containers and start local dev services.
- `make down` — stop local containers.
- `make logs` — follow container logs.
- `make ps` — show running dev containers.
- `make sh-frontend` — open a shell inside the frontend container.
- `make sh-backend` — open a shell inside the backend container.
- `make generate-openapi` — regenerate the OpenAPI spec from TypeSpec.
- `make migrate` — run Laravel migrations.
- `make seed` — seed demo data into the backend database.
- `make migrate-seed` — recreate the database and seed demo data.
- `make backend-test` — run the Laravel test suite.
- Run project commands through `make` targets only. Do not run `npm`, `docker compose`, or other app workflow commands directly from the host shell.
- If a needed workflow does not have a `make` target yet, add or agree on a `make` target first instead of using the raw command directly.

## Coding Style & Naming Conventions

- Use PHP 8.5 and Laravel conventions in `backend/`.
- Keep backend controllers thin, move business logic to services, and keep data access in repository classes.
- Do not write direct DB queries in services; go through repositories.
- Keep Eloquent models simple: attributes, casts, and relations only.
- Use TypeScript with 2-space indentation and semicolons as already used in `frontend/src/`.
- Prefer functional React components and colocate page-specific logic in the page file unless it becomes reusable.
- Use `PascalCase` for React components, `camelCase` for variables/functions, and descriptive hook names such as `useCreateBooking`.
- Keep API-related types in `frontend/src/api/types.ts` and formatting helpers in `frontend/src/utils/format.ts`.
- No formatter or linter config is committed yet, so match the existing style exactly.

## Testing Guidelines

- Use `make`-based verification only. Do not use direct host commands like `cd frontend && npm run build`.
- If a verification step is needed and there is no suitable `make` target yet, add one first or explicitly align on the expected command path.
- For API/schema changes, also run `make generate-openapi`.
- For backend changes, prefer `make backend-test`; for DB/demo data changes, also run `make migrate-seed`.
- Backend feature tests live in `backend/tests/Feature/`.
- If you add tests later, place them next to the feature or under a dedicated `__tests__` directory and use `*.test.ts(x)` naming.

## Commit & Pull Request Guidelines

- Follow the repository’s existing commit style: short, imperative messages, optionally scoped, for example `frontend: simplify guest homepage`.
- Keep commits focused; avoid mixing UI, API, and generated spec changes unless they are part of one feature.
- PRs should include a brief summary, affected screens or modules, manual verification steps, and screenshots for visible UI changes.
- Do not modify `.github/workflows/hexlet-check.yml`; it is Hexlet-managed CI.

## Security & Configuration Tips

- Treat `docs/openapi.yaml` as generated output; edit `docs/calendar.tsp` instead.
- The backend HTTP entrypoint runs on port `8080`, frontend on `5173`, PostgreSQL in Docker.
- API routes currently use paths like `/owner/...` and `/public/...` without an `/api` prefix.
- Do not commit secrets or environment-specific credentials.
