@echo off
echo ========================================
echo Starting Nexus Frontend (Next.js)
echo ========================================
echo.

cd nexus-frontend

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Next.js development server...
echo.
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
