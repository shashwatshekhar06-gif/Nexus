# 🚀 Quick Start Guide

## The 401 Error You're Seeing

The error `Request failed with status code 401` means the **backend is not running**. You need to start it first!

## Fix in 2 Steps:

### Step 1: Start Backend (Required!)

**Windows:**
```bash
# Double-click this file:
start-backend.bat

# OR run in terminal:
docker-compose up -d
```

**Mac/Linux:**
```bash
docker-compose up -d
```

Wait 10-15 seconds for the database to initialize.

### Step 2: Start Frontend

**Windows:**
```bash
# Double-click this file:
start-frontend.bat

# OR run in terminal:
cd nexus-frontend
npm run dev
```

**Mac/Linux:**
```bash
cd nexus-frontend
npm run dev
```

## Verify Backend is Running

Open in browser: http://localhost:5001/api/docs

You should see the Swagger API documentation.

## Login Credentials

Once both servers are running, go to http://localhost:3000 and login with:

```
Email: admin@nexus.dev
Password: Admin@123
```

## Still Getting 401 Error?

### Check 1: Is Docker running?
```bash
docker ps
```

You should see 2 containers: `nexus-api` and `nexus-db`

### Check 2: Are the containers healthy?
```bash
docker-compose ps
```

Both should show "Up" status.

### Check 3: View backend logs
```bash
docker-compose logs -f api
```

Look for "Nest application successfully started" message.

### Check 4: Test the API directly
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@nexus.dev\",\"password\":\"Admin@123\"}"
```

You should get a JSON response with an access token.

## Common Issues

### "Docker is not running"
- Start Docker Desktop
- Wait for it to fully start (whale icon in system tray)
- Try again

### "Port 5000 is already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Database connection failed"
```bash
# Restart everything
docker-compose down
docker-compose up -d
```

### "Wrong credentials"
The password is `Admin@123` (capital A, not lowercase!)

## Stop Everything

### Stop Frontend
Press `Ctrl+C` in the terminal

### Stop Backend
```bash
docker-compose down
```

## Need Help?

Check the detailed guide: [START_SERVERS.md](./START_SERVERS.md)
