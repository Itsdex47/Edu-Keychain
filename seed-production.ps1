# Production Database Seeding Script for Windows PowerShell
# This script helps you seed your production database with demo data

param(
    [Parameter(Mandatory=$true)]
    [string]$VercelUrl
)

Write-Host "🌱 Edu-Keychain Production Database Seeder" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

$SeedUrl = "$VercelUrl/api/seed"

Write-Host "🎯 Target URL: $SeedUrl" -ForegroundColor Cyan
Write-Host ""

# Test if the API endpoint is accessible
Write-Host "🔍 Testing API endpoint..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri $SeedUrl -Method Get -ErrorAction Stop
    Write-Host "✅ API endpoint is accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ API endpoint is not accessible. Please check your URL and deployment." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting database seeding..." -ForegroundColor Yellow
Write-Host ""

try {
    # Make the POST request to seed the database
    $response = Invoke-RestMethod -Uri $SeedUrl -Method Post -ContentType "application/json"
    
    if ($response.success -eq $true) {
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Seeding Summary:" -ForegroundColor Cyan
        Write-Host "Institutions: $($response.data.institutions)" -ForegroundColor White
        Write-Host "Students: $($response.data.students)" -ForegroundColor White
        Write-Host "Academic Records: $($response.data.academicRecords)" -ForegroundColor White
        Write-Host "Athletic Records: $($response.data.athleticRecords)" -ForegroundColor White
        Write-Host "Certificates: $($response.data.certificates)" -ForegroundColor White
        Write-Host "Blockchain Records: $($response.data.blockchainRecords)" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 Your production database now has demo data!" -ForegroundColor Green
        Write-Host "🌐 Visit: $VercelUrl/institution to see the seeded data" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Seeding failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Response:" -ForegroundColor Yellow
        $response | ConvertTo-Json -Depth 3
        Write-Host ""
        Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
        Write-Host "1. Check if your database is properly configured" -ForegroundColor White
        Write-Host "2. Verify your Vercel deployment is successful" -ForegroundColor White
        Write-Host "3. Check Vercel logs for any errors" -ForegroundColor White
        Write-Host "4. Ensure DATABASE_URL is set in Vercel environment variables" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Seeding failed with error!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check if your database is properly configured" -ForegroundColor White
    Write-Host "2. Verify your Vercel deployment is successful" -ForegroundColor White
    Write-Host "3. Check Vercel logs for any errors" -ForegroundColor White
    Write-Host "4. Ensure DATABASE_URL is set in Vercel environment variables" -ForegroundColor White
}
