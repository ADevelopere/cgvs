# PowerShell script to run demo data seeding
# Usage: .\seed-demo-data.ps1

Write-Host "🚀 CGSV Demo Data Seeder" -ForegroundColor Green
Write-Host "=" * 50

try {
    Write-Host "📦 Building the project..." -ForegroundColor Yellow
    ./gradlew build -x test
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🌱 Running demo data seeder..." -ForegroundColor Yellow
    ./gradlew seedDemoData
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Demo data seeding failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "🔍 Validating demo data..." -ForegroundColor Yellow
    ./gradlew validateDemoData
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Demo data validation failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "🎉 Demo data seeding completed successfully!" -ForegroundColor Green
    Write-Host "You can now start your Ktor server with:" -ForegroundColor Cyan
    Write-Host "  ./gradlew run" -ForegroundColor Cyan
    Write-Host "or start the dev server with:" -ForegroundColor Cyan
    Write-Host "  bun run dev" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
