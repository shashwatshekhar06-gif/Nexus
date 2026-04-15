# Nexus Project Management System - Setup Guide

## 📋 Overview
Full-stack project management system with NestJS backend + Next.js frontend.

---

## 🚀 Quick Start (2 Steps)

### Step 1: Start Backend (Docker)
```bash
docker-compose up -d
```

### Step 2: Start Frontend
```bash
cd nexus-frontend
npm install
npm run dev
```

**Done!** Open http://localhost:3000

---

## 🔗 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application UI |
| **Backend API** | http://localhost:5000 | REST API |
| **Swagger Docs** | http://localhost:5000/api/docs | Interactive API documentation |
| **Database** | localhost:5432 | PostgreSQL (Docker) |

---

## 👤 Test Accounts

### Admin Account
- **Email:** `admin@nexus.dev`
- **Password:** `Admin@123`
- **Access:** Full system access + admin panel

### Regular User Accounts
- **Email:** `alice@nexus.dev` | **Password:** `User@123`
- **Email:** `bob@nexus.dev` | **Password:** `User@123`
- **Access:** Can manage own projects and tasks

---

## 📦 Prerequisites

Make sure you have these installed:
- **Node.js** 18+ (https://nodejs.org/)
- **Docker Desktop** (https://www.docker.com/products/docker-desktop/)
- **Git** (https://git-scm.com/)

---

## 🛠️ Detailed Setup Instructions

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_REPO_URL>
cd nexus
```

### 2. Backend Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL + Backend in Docker
docker-compose up -d

# Check if containers are running
docker ps

# View logs if needed
docker-compose logs -f
```

#### Option B: Local Development
```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start PostgreSQL (Docker)
docker-compose up -d postgres

# Run database migrations
npx prisma migrate dev

# Seed database with test data
npx prisma db seed

# Start backend
npm run start:dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd nexus-frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local

# Start development server
npm run dev
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexus?schema=public"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# JWT Expiration
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 📚 API Documentation

### Swagger UI
Visit http://localhost:5000/api/docs for interactive API documentation.

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

#### Projects
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

#### Tasks
- `GET /api/v1/projects/:projectId/tasks` - List tasks
- `POST /api/v1/projects/:projectId/tasks` - Create task
- `GET /api/v1/projects/:projectId/tasks/:id` - Get task
- `PATCH /api/v1/projects/:projectId/tasks/:id` - Update task
- `DELETE /api/v1/projects/:projectId/tasks/:id` - Delete task

#### Admin (Admin only)
- `GET /api/v1/admin/users` - List all users
- `PATCH /api/v1/admin/users/:id/role` - Update user role
- `DELETE /api/v1/admin/users/:id` - Delete user

---

## 🎨 Features

### ✅ Implemented
- User authentication (JWT)
- Role-based access control (USER, ADMIN)
- Project management (CRUD)
- Task management (CRUD)
- Task filtering (status, priority)
- Clean Notion/Vercel UI design
- Responsive design (mobile, tablet, desktop)
- Admin panel
- Swagger API documentation

### 📋 Task Statuses
- TODO
- IN_PROGRESS
- IN_REVIEW
- DONE

### 🎯 Task Priorities
- LOW
- MEDIUM
- HIGH
- URGENT

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Restart Docker containers
docker-compose down
docker-compose up -d
```

### Frontend won't start
```bash
# Clear Next.js cache
cd nexus-frontend
rm -rf .next
npm run dev
```

### Database connection issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 Useful Commands

### Backend
```bash
# Start backend (Docker)
docker-compose up -d

# Stop backend
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v
docker-compose up -d
npx prisma migrate dev
npx prisma db seed

# Run tests
npm run test
npm run test:e2e
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Database
```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed
```

---

## 📁 Project Structure

```
nexus/
├── src/                    # Backend source code
│   ├── auth/              # Authentication module
│   ├── projects/          # Projects module
│   ├── tasks/             # Tasks module
│   ├── admin/             # Admin module
│   └── prisma/            # Database service
├── nexus-frontend/        # Frontend application
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── prisma/                # Database schema & migrations
├── docker-compose.yml     # Docker configuration
└── .env                   # Environment variables
```

---

## 🎯 Testing the Application

### 1. Login
- Go to http://localhost:3000
- Click "Login"
- Use: `admin@nexus.dev` / `Admin@123`

### 2. Create a Project
- Click "Projects" in navbar
- Click "Create Project"
- Fill in name and description
- Click "Create Project"

### 3. Add Tasks
- Click "View Tasks" on a project card
- Click "Create Task"
- Fill in task details
- Set status and priority
- Click "Create Task"

### 4. Filter Tasks
- Use status filters: ALL, TODO, IN PROGRESS, IN REVIEW, DONE
- Use priority filters: ALL, LOW, MEDIUM, HIGH, URGENT

### 5. Admin Panel (Admin only)
- Click "Admin" in navbar
- View all users
- Change user roles
- Delete users

---

## 🚢 Production Deployment

### Environment Variables to Change
```env
# Backend
JWT_SECRET="<generate-strong-random-secret>"
JWT_REFRESH_SECRET="<generate-strong-random-secret>"
DATABASE_URL="<your-production-database-url>"
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL="<your-production-api-url>"
```

### Build Commands
```bash
# Backend
npm run build
npm run start:prod

# Frontend
cd nexus-frontend
npm run build
npm run start
```

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Check Docker logs: `docker-compose logs -f`
3. Check browser console for frontend errors
4. Check Swagger docs for API issues: http://localhost:5000/api/docs

---

## 🎉 You're All Set!

The application should now be running at:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API Docs:** http://localhost:5000/api/docs

Login with `admin@nexus.dev` / `Admin@123` and start exploring!
