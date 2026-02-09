@echo off
REM ApplyTogether - Production Build Script (Windows)
REM This script builds both frontend and backend for production deployment

echo ========================================
echo ApplyTogether Production Build Script
echo ========================================

REM Build Backend
echo.
echo Building Backend (Spring Boot)...
cd Backend
call mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Backend build failed!
    exit /b 1
)
echo Backend build successful!
cd ..

REM Build Frontend
echo.
echo Building Frontend (React + Vite)...
cd Frontend
call npm install
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Frontend build failed!
    exit /b 1
)
echo Frontend build successful!
cd ..

REM Summary
echo.
echo ==========================================
echo Production Build Complete!
echo ==========================================
echo.
echo Artifacts:
echo    Backend:  Backend\target\applytogether-0.0.1-SNAPSHOT.jar
echo    Frontend: Frontend\dist\
echo.
echo Next Steps:
echo    1. Deploy backend JAR to your Oracle Cloud server
echo    2. Deploy frontend dist\ folder to Netlify/Vercel
echo    3. Configure environment variables
echo    4. See DEPLOYMENT.md for detailed instructions
echo.
pause
