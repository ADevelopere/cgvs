# PowerShell script to kill processes using a specific port

# Prompt for the port number
$port = Read-Host "Enter the port number to kill"

# Find all processes using the given port
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

$found = $false

if ($processes) {
    foreach ($processId in $processes) {
        try {
            $processName = (Get-Process -Id $processId -ErrorAction SilentlyContinue).ProcessName
            Write-Host "Killing process '$processName' with PID $processId that is using port $port..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force
            $found = $true
        }
        catch {
            Write-Host "Could not kill process with PID $processId" -ForegroundColor Red
        }
    }
}

# Check if any processes were found and killed
if (-not $found) {
    Write-Host "No processes found using port $port." -ForegroundColor Green
} else {
    Write-Host "All processes using port $port have been killed." -ForegroundColor Green
}

# Pause for user to see the output
Read-Host "Press Enter to continue..."
