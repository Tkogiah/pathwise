# Task 0.4 Plan — Docker Compose + Postgres

## Scope

- Add Docker Compose for local Postgres
- Optional pgAdmin service
- Document connection details

## Proposed Services

- postgres: `postgres:16-alpine`
- pgAdmin: `dpage/pgadmin4` (commented out)

## Environment

- POSTGRES_USER=pathwise
- POSTGRES_PASSWORD=pathwise
- POSTGRES_DB=pathwise_dev
- Port mapping: `${POSTGRES_PORT:-5432}:5432`

## Steps

1. Create `infra/compose/docker-compose.yml`
   - Postgres service with named volume
   - Port mapping uses `${POSTGRES_PORT:-5432}`
   - Healthcheck using `pg_isready`
   - Include pgAdmin block commented out with instructions
2. Create `.env.example` at root
   - `DATABASE_URL=postgresql://pathwise:pathwise@localhost:${POSTGRES_PORT:-5432}/pathwise_dev`
   - Optional `POSTGRES_PORT=5432` note
3. Add root scripts
   - `db:up`: `docker compose -f infra/compose/docker-compose.yml up -d`
   - `db:down`: `docker compose -f infra/compose/docker-compose.yml down`
4. Verify
   - `npm run db:up` starts Postgres
   - Confirm container health
   - `npm run db:down` stops cleanly

## Notes

- Docker prerequisite is assumed.
- Named volume persists data unless `down -v`.
- No `.env` is created; developers copy from `.env.example`.
