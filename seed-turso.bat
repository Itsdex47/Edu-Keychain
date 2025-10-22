@echo off
echo 🌱 Turso Database Seeder
echo =======================
echo.

set /p DATABASE_URL="Enter your Turso database URL (libsql://your-db.turso.io): "
if "%DATABASE_URL%"=="" (
    echo ❌ Database URL is required!
    pause
    exit /b 1
)

set /p AUTH_TOKEN="Enter your Turso auth token (optional, press Enter to skip): "

echo.
echo 🚀 Starting seeding process...
echo Database: %DATABASE_URL%
echo Auth Token: %AUTH_TOKEN%
echo.

if "%AUTH_TOKEN%"=="" (
    npx tsx seed-turso.ts "%DATABASE_URL%"
) else (
    npx tsx seed-turso.ts "%DATABASE_URL%" "%AUTH_TOKEN%"
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Seeding completed successfully!
    echo 🌐 Your Vercel app should now display the demo data
) else (
    echo.
    echo ❌ Seeding failed!
    echo.
    echo 💡 Troubleshooting:
    echo 1. Verify your database URL is correct
    echo 2. Check if your auth token is valid
    echo 3. Ensure your Turso database is accessible
    echo 4. Check your internet connection
)

pause
