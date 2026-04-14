# Nexus API

Production-grade project and task management REST API built with NestJS, designed for internship project tracking with role-based access control.

## Stack Rationale

- **NestJS (latest)**: Structured, DI-based, enterprise-grade framework. Swagger built-in. Guards and Pipes are first-class citizens.
- **Prisma**: Type-safe ORM with clean migrations and excellent PostgreSQL support
- **class-validator + class-transformer**: DTO-level validation with decorators
- **@nestjs/jwt + passport-jwt**: Industry-standard JWT authentication strategy
- **@nestjs/throttler**: Rate limiting (Redis-backed in production, in-memory for development)
- **@nestjs/swagger**: Auto-generates OpenAPI spec from decorators
- **Jest + Supertest**: Integration tests for auth, RBAC, and CRUD flows
- **Docker Compose**: Zero-dependency local setup

## Features

- JWT-based authentication with refresh tokens
- Role-based access control (USER, ADMIN)
- Project and task management with ownership validation
- Comprehensive validation and error handling
- Rate limiting (100 req/min global, 10 req/min for auth endpoints)
- Auto-generated OpenAPI documentation
- Security headers (Helmet)
- CORS configuration
- Pagination support
- Docker deployment ready

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker-compose up
```

## API Documentation

Once the application is running, visit:
- Swagger UI: `http://localhost:5000/api/docs`
- API Base URL: `http://localhost:5000/api/v1`

## Default Users

After seeding, the following users are available:

- **Admin**: admin@nexus.dev / Admin@123
- **User 1**: alice@nexus.dev / User@123
- **User 2**: bob@nexus.dev / User@123

## API Endpoints

### Authentication (Public)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (requires JWT)
- `GET /api/v1/auth/me` - Get current user (requires JWT)

### Projects (JWT Required)
- `GET /api/v1/projects` - List projects (paginated, filtered)
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project details
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `GET /api/v1/projects/:id/tasks` - List project tasks

### Tasks (JWT Required)
- `POST /api/v1/projects/:projectId/tasks` - Create task
- `GET /api/v1/projects/:projectId/tasks/:id` - Get task
- `PATCH /api/v1/projects/:projectId/tasks/:id` - Update task
- `DELETE /api/v1/projects/:projectId/tasks/:id` - Delete task

### Admin (ADMIN Role Only)
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/stats` - System statistics
- `PATCH /api/v1/admin/users/:id/role` - Update user role
- `GET /api/v1/admin/projects` - List all projects

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_ACCESS_SECRET | Secret for access tokens | - |
| JWT_REFRESH_SECRET | Secret for refresh tokens | - |
| JWT_ACCESS_EXPIRY | Access token expiry | 15m |
| JWT_REFRESH_EXPIRY | Refresh token expiry | 7d |
| PORT | Application port | 5000 |
| NODE_ENV | Environment | development |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |

## Security Features

- Bcrypt password hashing (12 rounds)
- JWT access tokens (15min expiry)
- JWT refresh tokens (7d expiry, stored as hash)
- HttpOnly cookies for refresh tokens
- Rate limiting
- Helmet security headers
- CORS restrictions
- Input validation
- UUID validation for parameters

## Project Structure

```
src/
├── auth/           # Authentication module
├── projects/       # Projects module
├── tasks/          # Tasks module
├── admin/          # Admin module
├── prisma/         # Prisma service
├── common/         # Shared utilities
│   ├── filters/    # Exception filters
│   ├── interceptors/ # Response interceptors
│   └── pipes/      # Custom pipes
├── app.module.ts   # Root module
└── main.ts         # Application entry point
```

## License

MIT
