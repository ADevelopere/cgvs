# PowerShell script for GraphQL generation
# Set error handling
$ErrorActionPreference = "Stop"

# Define paths
$GRAPHQL_DIR = ".\graphql\graphql-generated"
$SCHEMA_PATH = "$GRAPHQL_DIR\schema.graphql"
$GQLG_DIR = "$GRAPHQL_DIR\gqlg"
$GQLG_TS_DIR = "$GRAPHQL_DIR\gqlg-ts"

Write-Host "🚀 Starting GraphQL generation process..." -ForegroundColor Green

# Clean up directories
Write-Host "🧹 Cleaning up generated directories..." -ForegroundColor Yellow
if (Test-Path $GQLG_DIR) {
    Remove-Item -Recurse -Force $GQLG_DIR
}
if (Test-Path $GQLG_TS_DIR) {
    Remove-Item -Recurse -Force $GQLG_TS_DIR
}
New-Item -ItemType Directory -Force -Path $GQLG_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $GQLG_TS_DIR | Out-Null

# First codegen run
Write-Host "⚙️ Running first codegen..." -ForegroundColor Cyan
& bun run codegen

# Run gqlg
Write-Host "📝 Generating GraphQL types..." -ForegroundColor Cyan
& bunx gqlg --schemaFilePath $SCHEMA_PATH --destDirPath $GQLG_DIR --depthLimit 10

# Generate TypeScript files
Write-Host "🔄 Generating TypeScript files..." -ForegroundColor Cyan
& bun generate:gql-ts

# Second codegen run
Write-Host "🔄 Running second codegen..." -ForegroundColor Cyan
& bun run codegen

Write-Host "✅ GraphQL generation completed successfully!" -ForegroundColor Green
