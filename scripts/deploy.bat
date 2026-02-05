@echo off
pushd %~dp0..
echo 🚀 Starting Build Process...
powershell -ExecutionPolicy Bypass -File ./scripts/deploy.ps1
popd
pause
