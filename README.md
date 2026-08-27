# Running Analytics API

A full-stack analytics platform that syncs personal training data from the Strava API, stores it in a relational database, and surfaces performance trends through a set of SQL-driven endpoints and a React dashboard.

Built to fill specific gaps in my technical background — this project was my first hands-on work with TypeScript, cloud infrastructure (AWS), and production SQL, using my own running data as a real, motivating dataset.

## What it does

- Authenticates with Strava via OAuth2 and syncs activity history into a PostgreSQL database
- Computes training analytics using raw SQL aggregation queries (not an ORM abstraction):
  - Weekly mileage totals
  - Weekly average pace trends
  - Personal record detection (fastest 5K-range effort)
- Serves all of the above through a REST API
- Displays live data through a minimal React + TypeScript frontend

## Architecture

Strava API -> Express/TypeScript API (EC2) -> PostgreSQL (RDS)
OAuth2 handles authentication; Knex handles all database queries.
A React + TypeScript frontend consumes the API's stats endpoints.

**Backend:** Node.js, Express, TypeScript, Knex (query builder)
**Database:** PostgreSQL, hosted on AWS RDS
**Infrastructure:** AWS EC2 (deployment), AWS RDS, security-group-based network access control, pm2 for process management
**Auth:** Strava OAuth2 (authorization code flow, token refresh)
**Frontend:** React, TypeScript, Vite

## Database schema

Two tables with a foreign-key relationship:

- `athletes` — Strava identity and OAuth tokens (access token, refresh token, expiry)
- `activities` — synced run data (distance, moving/elapsed time, start time), linked to `athletes` via `athlete_id`, with a unique constraint on `activity_id` to keep syncs idempotent

## API endpoints

| Method | Route | Description |
|---|---|---|
| GET | /exchange_token | OAuth2 callback — exchanges an authorization code for access/refresh tokens |
| POST | /activities | Syncs recent activities from Strava into the database |
| GET | /stats/weekly-mileage | Total distance per week |
| GET | /stats/pace-trend | Average pace (min/km) per week |
| GET | /stats/personal-record-5k | Fastest recorded effort in the 5K distance range |

## Running locally

npm install
Create a .env file with: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET
npm run dev

## What I'd do differently / next steps

- Add token refresh logic so expired Strava tokens are renewed automatically instead of requiring manual re-authorization
- Move deployment to a CI/CD pipeline (GitHub Actions) instead of manual git pull + pm2 restart
- Expand the schema to capture elevation gain and heart rate data
