# Backend API

NestJS backend with Prisma, Redis, and PostgreSQL. Handles all the API stuff.

## What's Here

This is a working REST API with:

- **Full CRUD** for tasks (sample controller)
- **Prisma ORM** - type-safe database queries
- **Redis caching** - automatic caching that invalidates itself
- **PostgreSQL** - the actual database
- **Swagger docs** - interactive API documentation at `/api`
- **Validation** - requests get validated automatically
- **Error handling** - consistent error responses
- **Docker setup** - PostgreSQL and Redis in containers

## Quick Setup

```bash
npm install
copy env.template .env

cd ..
docker-compose up -d
cd backend

npm run prisma:migrate
npm run prisma:seed

npm run start:dev
```

API runs at http://localhost:3000, docs at http://localhost:3000/api

## Database Schema

Right now there's just one model:

```prisma
model Task {
  id          String   @id @default(uuid())
  name        String   @db.VarChar(100)
  description String   @db.VarChar(500)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

To add fields:

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Prisma generates the TypeScript types automatically

## Environment Variables

The `.env` file (copy from `env.template`):

Default values work for local development with Docker Compose.

---

Check the [main README](../README.md) for full project documentation.
