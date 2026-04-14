# 🎯 Nexus - Complete Startup Guide

## ⚠️ You're Getting a 401 Error Because...

**The backend server is not running!** The frontend is trying to connect to `http://localhost:5000` but nothing is there.

---

## ✅ Solution: Start Both Servers

### 🔷 Method 1: Use the Startup Scripts (Easiest)

#### Windows:
1. **Double-click** `start-backend.bat` → Wait 15 seconds
2. **Double-click** `start-frontend.bat` → Wait for "Ready"
3. **Open browser** → http://localhost:3000
4. **Login** with `admin@nexus.dev` / `Admin@123`

#### Mac/Linux:
```bash
# Terminal 1: Start backend
docker-compose up -d

# Wait 15 seconds...

# Terminal 2: Start frontend
cd nexus-frontend && npm run dev

# Open browser: http://localhost:3000
```

---

### 🔷 Method 2: Manual Commands

#### Step 1: Start Backend
```bash
docker-compose up -d
```

**Wait 15 seconds** for PostgreSQL to initialize.

#### Step 2: Verify Backend
Open http://localhost:5000/api/docs - you should see Swagger UI.

#### Step 3: Start Frontend
```bash
cd nexus-frontend
npm run dev
```

#### Step 4: Open Application
Go to http://localhost:3000

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@nexus.dev` | `Admin@123` |
| User | `alice@nexus.dev` | `User@123` |
| User | `bob@nexus.dev` | `User@123` |

**⚠️ Note:** Password is `Admin@123` with capital A!

---

## 🔍 Check Status

Run this to see what's running:
```bash
# Windows
check-status.bat

# Mac/Linux
docker ps
curl http://localhost:5000/api/docs
curl http://localhost:3000
```

---

## 🐛 Troubleshooting

### Problem: "Docker is not running"
**Solution:** Start Docker Desktop and wait for it to fully load.

### Problem: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Problem: "401 Unauthorized" when logging in
**Causes:**
1. ❌ Backend not running → Run `docker-compose up -d`
2. ❌ Wrong password → Use `Admin@123` (capital A)
3. ❌ Database not seeded → Run `docker-compose down && docker-compose up -d`

**Test backend directly:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexus.dev","password":"Admin@123"}'
```

You should get a JSON response with `accessToken`.

### Problem: "Cannot connect to database"
**Solution:**
```bash
docker-compose down
docker-compose up -d
# Wait 20 seconds
```

### Problem: Frontend shows blank page
**Solution:**
1. Check browser console for errors
2. Verify backend is running: http://localhost:5000/api/docs
3. Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`
4. Restart frontend: `Ctrl+C` then `npm run dev`

---

## 🛑 Stop Everything

### Stop Frontend
Press `Ctrl+C` in the terminal running `npm run dev`

### Stop Backend
```bash
docker-compose down
```

---

## 📊 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js application |
| Backend API | http://localhost:5000 | NestJS REST API |
| API Docs | http://localhost:5000/api/docs | Swagger UI |
| Database | localhost:5432 | PostgreSQL |

---

## 🎨 What's New in the UI

The frontend has been completely redesigned with:
- ✨ Glassmorphism effects
- 🌈 Gradient aesthetics
- 🎭 Smooth animations
- 💫 Micro-interactions
- 🎯 Modern, professional design

See [nexus-frontend/UI_IMPROVEMENTS.md](nexus-frontend/UI_IMPROVEMENTS.md) for details.

---

## 📚 Additional Resources

- **Detailed Startup Guide:** [START_SERVERS.md](START_SERVERS.md)
- **Quick Start:** [QUICK_START.md](QUICK_START.md)
- **UI Improvements:** [nexus-frontend/UI_IMPROVEMENTS.md](nexus-frontend/UI_IMPROVEMENTS.md)
- **API Spec:** [.kiro/specs/nexus-api/](. kiro/specs/nexus-api/)
- **Frontend Spec:** [.kiro/specs/nexus-frontend/](.kiro/specs/nexus-frontend/)

---

## 🚀 Quick Commands Reference

```bash
# Start everything
docker-compose up -d && cd nexus-frontend && npm run dev

# Stop everything
docker-compose down

# View backend logs
docker-compose logs -f api

# View all containers
docker ps

# Restart backend
docker-compose restart api

# Reset database (WARNING: deletes all data)
docker-compose down -v && docker-compose up -d

# Check status
docker-compose ps
```

---

## ✅ Success Checklist

- [ ] Docker Desktop is running
- [ ] `docker-compose up -d` completed successfully
- [ ] http://localhost:5000/api/docs shows Swagger UI
- [ ] `npm run dev` is running in nexus-frontend
- [ ] http://localhost:3000 shows the landing page
- [ ] Can login with `admin@nexus.dev` / `Admin@123`
- [ ] Dashboard loads after login

If all checkboxes are ✅, you're good to go! 🎉

---

## 💡 Pro Tips

1. **Keep Docker running** - The backend needs it
2. **Use the test accounts** - They're already seeded
3. **Check the Swagger docs** - Great for API testing
4. **Watch the logs** - `docker-compose logs -f` shows what's happening
5. **Restart if stuck** - `docker-compose down && docker-compose up -d`

---

## 🆘 Still Having Issues?

1. Run `check-status.bat` (Windows) to diagnose
2. Check `docker-compose logs -f api` for backend errors
3. Check browser console (F12) for frontend errors
4. Verify `.env.local` exists in `nexus-frontend/`
5. Try restarting everything: `docker-compose down && docker-compose up -d`

---

**Happy coding! 🚀**
