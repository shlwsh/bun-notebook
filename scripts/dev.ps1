# Tauri Development Script with Configurable Port
# Usage: .\scripts\dev.ps1 -Port 1420

param (
    [int]$Port = 0
)

# Load from .env if Port not provided
if ($Port -eq 0) {
    if (Test-Path ".env") {
        $envFile = Get-Content ".env" | ConvertFrom-StringData
        if ($envFile.VITE_PORT) {
            $Port = [int]$envFile.VITE_PORT
        }
    }
}

# Default to 1420 if still 0
if ($Port -eq 0) { $Port = 1420 }

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   Bun CodeView - Development Mode" -ForegroundColor Cyan
Write-Host "   Target Port: $Port" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Check port availability
Write-Host "[!] Checking port $Port..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "[!] Port $Port is currently occupied. Cleaning up..." -ForegroundColor Yellow
    powershell -File ./scripts/ensure-port.ps1 -Port $Port
}

# Run Tauri Dev with config override
$env:VITE_PORT = $Port
# Use escaped double quotes for PowerShell to pass them correctly
$configOverride = '{\"build\":{\"devUrl\":\"http://localhost:' + $Port + '\"}}'

Write-Host "🚀 Starting Tauri dev with config override (Port: $Port)..." -ForegroundColor Green
bun tauri dev --config "$configOverride"
