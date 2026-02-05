# Tauri Application Deployment Script
# This script handles the building and packaging of the Bun CodeView application

$ErrorActionPreference = "Stop"

Clear-Host
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   Bun CodeView - Packaging & Deployment Script" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Environment Check
Write-Host "[1/4] Checking environment..." -ForegroundColor Yellow
if (!(Get-Command "bun" -ErrorAction SilentlyContinue)) {
    Write-Host "[-] Bun not found. Please install Bun first." -ForegroundColor Red
    exit 1
}

# 2. Dependency Installation
Write-Host "[2/4] Installing dependencies..." -ForegroundColor Yellow
bun install

# 3. Build Process
Write-Host "[3/4] Building Tauri application (Release mode)..." -ForegroundColor Yellow
Write-Host "      This may take a few minutes as Rust compiles the backend." -ForegroundColor Gray
bun tauri build

# 4. Success and Output Information
Write-Host "`n====================================================" -ForegroundColor Green
Write-Host "✅ Build Successfully Completed!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

$releaseDir = Resolve-Path "src-tauri/target/release"
$bundleDir = Join-Path $releaseDir "bundle"

Write-Host "`n📁 Deployment Assets:" -ForegroundColor White
Write-Host "   -> Binary: $releaseDir/bun-codeview.exe" -ForegroundColor Gray
if (Test-Path "$bundleDir/msi") {
    $msi = Get-ChildItem "$bundleDir/msi/*.msi" | Select-Object -First 1
    Write-Host "   -> Installer: $($msi.FullName)" -ForegroundColor Gray
}

Write-Host "`n🚀 You can run the application directly from the release folder." -ForegroundColor Cyan
Write-Host "   Open: $releaseDir" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Cyan
