# ApplyTogether

A social job-sharing platform where friends can help each other discover and track job opportunities.

## Architecture

- **Frontend**: React 18 + Vite, served on port 5000
- **Backend**: Spring Boot 3.4.1 (Java 19), served on port 8080
- **Database**: H2 in-memory by default (PostgreSQL via env vars in production)
- **Auth**: JWT-based authentication

## Project Structure

```
ApplyTogether/
├── Backend/                    # Spring Boot application
│   ├── src/main/java/          # Controllers, Entities, Repositories, Services
│   ├── src/main/resources/     # application.properties
│   └── pom.xml                 # Maven config (Java 19)
├── Frontend/                   # React + Vite application
│   ├── src/                    # Components, Pages, Context, Hooks, API
│   ├── vite.config.js          # Vite config: port 5000, proxy /api → localhost:8080
│   └── package.json
└── replit.md
```

## Workflows

- **Start application** — Frontend dev server (Vite on port 5000, webview)
- **Backend** — Spring Boot API (Maven on port 8080, console)

## Key Configuration

- `Frontend/vite.config.js`: hosts `0.0.0.0`, port `5000`, `allowedHosts: true`, proxies `/api` to backend
- `Backend/src/main/resources/application.properties`: H2 default DB, JWT secret via env var, port 8080
- Java version set to 19 in `Backend/pom.xml` (GraalVM 22.3 available in Replit)

## Environment Variables

- `SPRING_DATASOURCE_URL` — PostgreSQL URL (optional, defaults to H2 in-memory)
- `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` — DB credentials
- `JWT_SECRET` — JWT signing secret (min 32 chars)
- `FRONTEND_URL` — CORS allowed origin(s)

## Features

- Social job discovery and sharing
- Application tracking
- Friend/follow network
- Real-time notifications
- Admin analytics dashboard
