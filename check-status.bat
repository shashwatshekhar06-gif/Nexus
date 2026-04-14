@echo off
echo ========================================
echo Nexus Application Status Check
echo ========================================
echo.

echo [1/4] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is NOT running
    echo    Please start Docker Desktop
    echo.
) else (
    echo ✅ Docker is running
    echo.
)

echo [2/4] Checking Backend Containers...
docker-compose ps 2>nul | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Backend containers are NOT running
    echo    Run: docker-compose up -d
    echo.
) else (
    echo ✅ Backend containers are running
    docker-compose ps
    echo.
)

echo [3/4] Checking Backend API...
curl -s http://localhost:5000/api/docs >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend API is NOT responding
    echo    URL: http://localhost:5000
    echo.
) else (
    echo ✅ Backend API is responding
    echo    URL: http://localhost:5000/api/docs
    echo.
)

echo [4/4] Checking Frontend...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend is NOT running
    echo    Run: cd nexus-frontend ^&^& npm run dev
    echo.
) else (
    echo ✅ Frontend is running
    echo    URL: http://localhost:3000
    echo.
)

echo ========================================
echo Summary
echo ========================================
echo.
echo If you see ❌ marks above, follow these steps:
echo.
echo 1. Start Docker Desktop (if not running)
echo 2. Run: docker-compose up -d
echo 3. Wait 15 seconds
echo 4. Run: cd nexus-frontend ^&^& npm run dev
echo 5. Open: http://localhost:3000
echo.
echo Login with:
echo   Email: admin@nexus.dev
echo   Password: Admin@123
echo.
pause
