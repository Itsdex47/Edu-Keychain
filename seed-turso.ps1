# Turso Database Seeding Script
# This script will seed your Turso database with demo data

Write-Host "🌱 Turso Database Seeder" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host ""

# Get database URL from user
$databaseUrl = Read-Host "Enter your Turso database URL (libsql://your-db.turso.io)"
if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
    Write-Host "❌ Database URL is required!" -ForegroundColor Red
    exit 1
}

# Get auth token from user
$authToken = Read-Host "Enter your Turso auth token (optional, press Enter to skip)"
if ([string]::IsNullOrWhiteSpace($authToken)) {
    $authToken = $null
}

Write-Host ""
Write-Host "🚀 Starting seeding process..." -ForegroundColor Yellow
Write-Host "Database: $databaseUrl" -ForegroundColor Cyan
Write-Host "Auth Token: $(if($authToken) { '***' + $authToken.Substring($authToken.Length - 4) } else { 'None' })" -ForegroundColor Cyan
Write-Host ""

try {
    # Run the seeding script
    if ($authToken) {
        npx tsx seed-turso.ts $databaseUrl $authToken
    } else {
        npx tsx seed-turso.ts $databaseUrl
    }
    
    Write-Host ""
    Write-Host "✅ Seeding completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Your Vercel app should now display the demo data" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "❌ Seeding failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verify your database URL is correct" -ForegroundColor White
    Write-Host "2. Check if your auth token is valid" -ForegroundColor White
    Write-Host "3. Ensure your Turso database is accessible" -ForegroundColor White
    Write-Host "4. Check your internet connection" -ForegroundColor White
}
