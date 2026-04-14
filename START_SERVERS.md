# How to Start Nexus Application

## Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ installed
- Ports 3000 (frontend) and 5000 (backend) available

## Step 1: Start Backend (NestJS API + PostgreSQL)

### Option A: Using Docker (Recommended)
```bash
# From the root directory
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- NestJS API on port 5000

### Option B: Local Development
```bash
# Install dependencies
npm install

# Start PostgreSQL (you need a running PostgreSQL instance)
# Update .env with your database credentials

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the backend
npm run start:dev
```

### Verify Backend is Running
Open http://localhost:5000/api/docs in your browser
You should see the Swagger API documentation.

### Test Backend Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexus.dev","password":"Admin@123"}'
```

You should get a response with an access token.

## Step 2: Start Frontend (Next.js)

```bash
# Navigate to frontend directory
cd nexus-frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:3000

## Step 3: Login

### Test Accounts (from seed data)

**Admin Account:**
- Email: `admin@nexus.dev`
- Password: `Admin@123`
- Role: ADMIN

**Regular User 1:**
- Email: `alice@nexus.dev`
- Password: `User@123`
- Role: USER

**Regular User 2:**
- Email: `bob@nexus.dev`
- Password: `User@123`
- Role: USER

## Troubleshooting

### Backend Issues

**Error: Port 5000 already in use**
```bash
# Find and kill the process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Error: Database connection failed**
```bash
# Check if PostgreSQL is running
docker ps

# Restart Docker containers
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs -f
```

**Error: Prisma schema out of sync**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or just run migrations
npx prisma migrate dev
```

### Frontend Issues

**Error: NEXT_PUBLIC_API_URL not defined**
- Make sure `nexus-frontend/.env.local` exists
- Restart the Next.js dev server after creating/modifying .env.local

**Error: Network request failed**
- Backend is not running - start it first
- Check if backend is accessible: http://localhost:5000/api/docs

**Error: 401 Unauthorized**
- Wrong credentials - use the test accounts above
- Backend database not seeded - run `npx prisma db seed`

**Error: CORS issues**
- Backend should allow localhost:3000 by default
- Check `src/main.ts` for CORS configuration

### Port Conflicts

**Frontend (3000)**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Backend (5000)**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## Quick Start (All-in-One)

```bash
# Terminal 1: Start backend with Docker
docker-compose up -d

# Wait 10 seconds for database to initialize

# Terminal 2: Start frontend
cd nexus-frontend && npm run dev
```

Then open http://localhost:3000 and login with `admin@nexus.dev` / `Admin@123`

## Stopping the Application

### Stop Frontend
Press `Ctrl+C` in the terminal running `npm run dev`

### Stop Backend
```bash
# If using Docker
docker-compose down

# If running locally
Press Ctrl+C in the terminal running the backend
```

## Development Workflow

1. **Backend changes**: The NestJS server will auto-reload
2. **Frontend changes**: Next.js will hot-reload automatically
3. **Database schema changes**: 
   ```bash
   npx prisma migrate dev --name your_migration_name
   npx prisma generate
   ```
4. **Environment variable changes**: Restart the respective server

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:5000/api/docs
- API Base URL: http://localhost:5000/api/v1

## Database Management

### View Database
```bash
npx prisma studio
```
Opens a GUI at http://localhost:5555 to view/edit database records

### Reset Database
```bash
npx prisma migrate reset
```
Drops database, runs all migrations, and seeds data

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

## Production Build

### Backend
```bash
npm run build
npm run start:prod
```

### Frontend
```bash
cd nexus-frontend
npm run build
npm run start
```

## Docker Production Deployment

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```
