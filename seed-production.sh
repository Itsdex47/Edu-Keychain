#!/bin/bash

# Production Database Seeding Script
# This script helps you seed your production database with demo data

echo "🌱 Edu-Keychain Production Database Seeder"
echo "=========================================="

# Check if VERCEL_URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Vercel app URL"
    echo ""
    echo "Usage:"
    echo "  ./seed-production.sh https://your-app.vercel.app"
    echo ""
    echo "Or manually run:"
    echo "  curl -X POST https://your-app.vercel.app/api/seed"
    echo ""
    exit 1
fi

VERCEL_URL="$1"
SEED_URL="${VERCEL_URL}/api/seed"

echo "🎯 Target URL: $SEED_URL"
echo ""

# Test if the API endpoint is accessible
echo "🔍 Testing API endpoint..."
if curl -s -f "$SEED_URL" > /dev/null; then
    echo "✅ API endpoint is accessible"
else
    echo "❌ API endpoint is not accessible. Please check your URL and deployment."
    exit 1
fi

echo ""
echo "🚀 Starting database seeding..."
echo ""

# Make the POST request to seed the database
RESPONSE=$(curl -s -X POST "$SEED_URL" -H "Content-Type: application/json")

# Check if the response contains success
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📊 Seeding Summary:"
    echo "$RESPONSE" | jq -r '.data | "Institutions: \(.institutions)\nStudents: \(.students)\nAcademic Records: \(.academicRecords)\nAthletic Records: \(.athleticRecords)\nCertificates: \(.certificates)\nBlockchain Records: \(.blockchainRecords)"'
    echo ""
    echo "🎉 Your production database now has demo data!"
    echo "🌐 Visit: $VERCEL_URL/institution to see the seeded data"
else
    echo "❌ Seeding failed!"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | jq '.'
    echo ""
    echo "💡 Troubleshooting:"
    echo "1. Check if your database is properly configured"
    echo "2. Verify your Vercel deployment is successful"
    echo "3. Check Vercel logs for any errors"
    echo "4. Ensure DATABASE_URL is set in Vercel environment variables"
fi
