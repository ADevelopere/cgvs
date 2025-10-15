# Interactive DB actions script for cgsvNew project
# PowerShell version

$ErrorActionPreference = "Stop"

# Hash table of actions and their corresponding bun commands
$actions = @{
    "Reset Database" = "bun run server/db/scripts/resetDb.ts"
    "Seed Database" = "bun run server/db/scripts/drizzleSeed.ts"
    "Generate Drizzle Schema" = "bun drizzle-kit generate"
    "Drop Drizzle Schema" = "bun drizzle-kit drop"
    "Run Migrations" = "bun run server/db/scripts/migrate.ts"
    "Push Schema to DB" = "bun drizzle-kit push"
    "Open Drizzle Studio" = "bun drizzle-kit studio"
}

# Get action names
$actionNames = $actions.Keys | Sort-Object

# Check if fzf is available, otherwise use PowerShell menu
if (Get-Command fzf -ErrorAction SilentlyContinue) {
    # Use fzf for selection
    $selected = $actionNames | fzf --prompt="Select DB action: " --height=10 --border
    
    if (-not $selected) {
        Write-Host "No action selected. Exiting."
        exit 0
    }
} else {
    # Fallback to PowerShell menu
    Write-Host "Select a DB action:" -ForegroundColor Cyan
    Write-Host ""
    
    for ($i = 0; $i -lt $actionNames.Count; $i++) {
        Write-Host "[$($i + 1)] $($actionNames[$i])"
    }
    
    Write-Host ""
    $choice = Read-Host "Enter your choice (1-$($actionNames.Count))"
    
    try {
        $index = [int]$choice - 1
        if ($index -lt 0 -or $index -ge $actionNames.Count) {
            throw "Invalid selection"
        }
        $selected = $actionNames[$index]
    }
    catch {
        Write-Host "Invalid selection. Exiting." -ForegroundColor Red
        exit 1
    }
}

$cmd = $actions[$selected]

if (-not $cmd) {
    Write-Host "Error: No command found for selected action." -ForegroundColor Red
    exit 1
}

Write-Host "Running: $cmd" -ForegroundColor Yellow
Write-Host ""

# Run the selected command
$ErrorActionPreference = "Continue"  # Don't exit on command failure
try {
    Invoke-Expression $cmd
    $exitCode = $LASTEXITCODE
}
catch {
    $exitCode = 1
    Write-Host $_.Exception.Message -ForegroundColor Red
}
$ErrorActionPreference = "Stop"  # Re-enable exit on error

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✓ Command completed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Command failed with exit code: $exitCode" -ForegroundColor Red
    exit $exitCode
}