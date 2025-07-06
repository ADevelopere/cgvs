#!/bin/bash

# Bash script to run demo data seeding
# Usage: ./seed-demo-data.sh

echo "🚀 CGSV Demo Data Seeder"
echo "=================================================="

# Function to check if the last command was successful
check_status() {
    if [ $? -ne 0 ]; then
        echo "❌ $1 failed!"
        exit 1
    fi
}

echo "📦 Building the project..."
./gradlew build -x test
check_status "Build"

echo "✅ Build completed successfully!"
echo ""

echo "🌱 Running demo data seeder..."
./gradlew seedDemoData
check_status "Demo data seeding"

echo ""
echo "🔍 Validating demo data..."
./gradlew validateDemoData
check_status "Demo data validation"

echo ""
echo "🎉 Demo data seeding completed successfully!"
echo "You can now start your Ktor server with:"
echo "  ./gradlew run"
echo "or start the dev server with:"
echo "  bun run dev"
