@echo off
pushd %~dp0..
echo 🚀 Starting Development Mode...
powershell -ExecutionPolicy Bypass -File ./scripts/dev.ps1 %*
popd
