# Full-Stack Monorepo Starter

![Full-Stack Monorepo Starter](./background.png)

A ready-to-use NestJS + Angular monorepo with Prisma, Redis, and PostgreSQL.

## Why This Exists

I got tired of spending hours setting up the same stack every time I started a new project. Database migrations, Redis caching, proper validation, API docs - it's always the same setup. So I built this template once and properly, so I (and you) can just clone it and start building features instead of infrastructure.

This is what I wish existed when I was starting projects. No fluff, just a working full-stack setup that you can actually use.

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
# 1. Clone and install
git clone <your-repo-url>
cd fullstack-monorepo-starter
npm run install:all

# 2. Start Docker (PostgreSQL + Redis)
docker-compose up -d

# 3. Copy the env file (defaults work fine)
cd backend
copy env.template .env
cd ..

# 4. Setup database
cd backend
npm run prisma:migrate
npm run prisma:seed
cd ..

# 5. Start the app
npm start  # Starts both backend and frontend
```

**Done!**

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API docs: http://localhost:3000/api

## API Endpoints

Base path: `/api/tasks`

| Method | Endpoint     | What it does  |
| ------ | ------------ | ------------- |
| GET    | `/tasks`     | Get all tasks |
| GET    | `/tasks/:id` | Get one task  |
| POST   | `/tasks`     | Create a task |
| PUT    | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Example request:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "My task", "description": "Do something"}'
```

The API returns consistent JSON responses and handles errors properly. Check http://localhost:3000/api for the full Swagger documentation.

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

## Making It Yours

### Change the Entity

Right now it's "Tasks". Want to build something else?

1. Edit `backend/prisma/schema.prisma` - change `Task` to your entity
2. Rename `task.dto.ts` to your entity name
3. Update controller and service files
4. Run `npm run prisma:migrate`

That's it.

### Add More Fields

Edit the Prisma schema:

```prisma
model Task {
  id          String   @id @default(uuid())
  name        String
  description String
  priority    String?  // Add fields like this
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then run:

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### Add Authentication

JWT and Passport are already installed. You just need to:

1. Create an auth module
2. Add a JWT strategy
3. Protect your routes with guards

The packages are there, the setup is standard NestJS auth.

## Common Issues

**"Cannot find module '@prisma/client'"**

```bash
cd backend
npm run prisma:generate
```

**"Port 3000 is already in use"**

- Kill whatever's using it, or change PORT in `.env`

**Database won't connect**

```bash
docker-compose ps  # Make sure PostgreSQL is running
docker-compose up -d  # Start it if needed
```

**Redis errors**

```bash
docker-compose logs redis  # Check what's wrong
docker-compose restart redis  # Try restarting
```

## Tech Stack

- **NestJS** - The backend framework (like Express but better structured)
- **Prisma** - Database ORM (writes SQL for you, gives you types)
- **PostgreSQL** - Database (reliable, well-supported)
- **Redis** - Cache (makes things fast)
- **TypeScript** - JavaScript with types (catches bugs early)
- **Docker** - Runs PostgreSQL and Redis locally

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
