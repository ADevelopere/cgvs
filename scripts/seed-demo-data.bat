@echo off
echo 🚀 CGSV Demo Data Seeder
echo ==================================================

echo 📦 Building the project...
call gradlew.bat build -x test
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

echo 🌱 Running demo data seeder...
call gradlew.bat seedDemoData
if %errorlevel% neq 0 (
    echo ❌ Demo data seeding failed!
    pause
    exit /b 1
)

echo.
echo 🔍 Validating demo data...
call gradlew.bat validateDemoData
if %errorlevel% neq 0 (
    echo ❌ Demo data validation failed!
    pause
    exit /b 1
)

echo.
echo 🎉 Demo data seeding completed successfully!
echo You can now start your Ktor server with:
echo   gradlew.bat run
echo or start the dev server with:
echo   bun run dev

pause
