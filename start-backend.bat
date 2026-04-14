@echo off
echo ========================================
echo Starting Nexus Backend (Docker)
echo ========================================
echo.

echo Checking if Docker is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running!
echo.

echo Starting PostgreSQL and NestJS API...
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Backend Status:
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Backend is starting!
echo ========================================
echo.
echo API will be available at: http://localhost:5000
echo Swagger Docs: http://localhost:5000/api/docs
echo.
echo Test login credentials:
echo   Email: admin@nexus.dev
echo   Password: Admin@123
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause
