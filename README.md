# Full-Stack Monorepo Starter

![Full-Stack Monorepo Starter](./background.png)

<p align="center">
  <a href="https://github.com/amin-norollah/fullstack-monorepo-starter/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/node-%3E%3D20.19-green.svg" alt="Node"></a>
  <a href="#"><img src="https://img.shields.io/badge/typescript-5.7-blue.svg" alt="TypeScript"></a>
</p>

A ready-to-use NestJS + Angular monorepo with Prisma, Redis, and PostgreSQL.

## Why This Exists

I got tired of spending hours setting up the same stack every time I started a new project. Database migrations, Redis caching, proper validation, API docs - it's always the same setup. So I built this template once and properly, so I (and you) can just clone it and start building features instead of infrastructure.

This is what I wish existed when I was starting projects. No fluff, just a working full-stack setup that you can actually use.

**Time saved:** ~4-6 hours per project setup → ~5 minutes with this template.

## What You Get

**Backend:**

- NestJS API with TypeScript
- Prisma ORM (type-safe database queries)
- PostgreSQL database
- Redis caching (already configured)
- Swagger docs at `/api`
- Request validation
- Docker setup for local development

**Frontend:**

- Angular 19 with standalone components
- Task management UI
- Reactive forms
- HTTP client with RxJS

**The boring stuff that's already done:**

- Error handling
- Response formatting
- Database migrations
- Sample data seeding
- Environment configs
- Docker Compose setup

## Quick Start

You need Node.js 20+, npm, and Docker installed.

```bash
git clone https://github.com/amin-norollah/fullstack-monorepo-starter.git
cd fullstack-monorepo-starter
npm run install:all

docker-compose up -d

cd backend
copy env.template .env
cd ..

cd backend
npm run prisma:migrate
npm run prisma:seed
cd ..

npm start
```

**Done!**

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API docs: http://localhost:3000/api

## Project Structure

```
fullstack-monorepo-starter/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Your database models
│   │   └── seed.ts             # Sample data
│   ├── src/
│   │   ├── common/             # Shared stuff (filters, interceptors)
│   │   ├── dto/                # Request/response validation
│   │   ├── prisma/             # Database service
│   │   ├── redis/              # Cache service
│   │   ├── app.controller.ts  # Your API endpoints
│   │   ├── app.service.ts     # Your business logic
│   │   └── main.ts            # App entry point
│   └── env.template           # Copy this to .env
├── frontend/                  # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Task list component
│   │   │   ├── services/     # API service
│   │   │   └── ...
│   │   └── index.html
│   └── package.json
├── docker-compose.yml         # PostgreSQL + Redis
└── package.json
```

## Development Commands

**Backend:**

```bash
cd backend

npm run start:dev              # Hot reload development
npm run prisma:studio          # Visual database browser
npm run prisma:migrate         # Create/run migrations
npm run prisma:seed            # Add sample data
npm run test                   # Run tests
```

**Frontend:**

```bash
cd frontend

npm start                      # Dev server (port 4200)
npm run build                  # Build for production
```

**Docker:**

```bash
docker-compose up -d           # Start services
docker-compose down            # Stop services
docker-compose logs -f         # View logs
```

**Root:**

```bash
npm start                      # Start both backend and frontend
npm run start:backend          # Backend only
npm run start:frontend         # Frontend only
```

## What's Actually Useful Here

### 1. Redis Caching (Already Working)

The service layer automatically caches tasks in Redis for 5 minutes. No extra code needed:

```typescript
// This automatically uses cache
const tasks = await this.appService.getTasks();
```

Cache invalidates automatically when you create/update/delete tasks.

### 2. Type-Safe Database

Prisma gives you autocomplete and type safety:

```typescript
const task = await prisma.task.findUnique({
  where: { id: "123" },
});
// TypeScript knows exactly what 'task' contains
```

### 3. Validation That Actually Works

Just use decorators on your DTOs:

```typescript
export class CreateTaskDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;
}
```

Invalid requests get rejected automatically with clear error messages.

### 4. Database Migrations

Change your schema, run one command:

```bash
npm run prisma:migrate
```

Prisma handles the rest. No manual SQL, no migration hell.

## Environment Setup

Copy `backend/env.template` to `backend/.env`. Defaults work for local development:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fullstack_monorepo_starter?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
```

For production, change the database URL and add a strong JWT secret.

## Tech Stack

| Technology     | Purpose           | Why This One                                |
| -------------- | ----------------- | ------------------------------------------- |
| **NestJS**     | Backend framework | Better structured than Express, built-in DI |
| **Prisma**     | Database ORM      | Type-safe queries, easy migrations          |
| **PostgreSQL** | Database          | Reliable, feature-rich, well-supported      |
| **Redis**      | Caching           | Fast, simple, perfect for sessions/cache    |
| **Angular**    | Frontend          | Powerful, complete framework                |
| **TypeScript** | Language          | Catches bugs before runtime                 |
| **Docker**     | Development       | Consistent local environment                |

## What's Not Included

- Authentication (JWT packages are installed, but you need to implement it)
- File uploads
- Email sending
- Real-time features (WebSockets)
- Advanced form validation on frontend
- State management (NgRx, etc.)

These are all easy to add when you need them. The foundation is here.

## Deployment

For production:

1. Set `NODE_ENV=production` in your env
2. Use a real database URL (not localhost)
3. Set a strong random `JWT_SECRET`
4. Build with `npm run build`
5. Run with `npm run start:prod`

For Docker deployment, create a Dockerfile in the backend folder. Standard Node.js container setup works fine.

## Contributing

Found a bug? Have a better way to do something? PRs welcome.

## License

MIT - use it however you want.

---

**That's it.** Clone it, run 5 commands, start coding 🚀😍.

if something's not working, open an issue. if it helps you, star it on GitHub🙏.
