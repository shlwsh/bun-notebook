#!/bin/bash
# Tauri Development Script with Configurable Port for macOS/Linux
# Usage: ./scripts/dev.sh [port]

PORT=${1:-0}

# Load from .env if Port not provided
if [ "$PORT" -eq 0 ] && [ -f ".env" ]; then
    PORT=$(grep VITE_PORT .env | cut -d '=' -f2 | tr -d ' ')
fi

# Default to 1420 if still empty
if [ -z "$PORT" ] || [ "$PORT" -eq 0 ]; then
    PORT=1420
fi

echo "===================================================="
echo "   Bun CodeView - Development Mode"
echo "   Target Port: $PORT"
echo "===================================================="

# Check port availability
echo "[!] Checking port $PORT..."
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "[!] Port $PORT is currently occupied. Cleaning up..."
    PID=$(lsof -ti:$PORT)
    if [ ! -z "$PID" ]; then
        kill -9 $PID
        echo "[✓] Killed process on port $PORT"
        sleep 1
    fi
fi

# Run Tauri Dev with config override
export VITE_PORT=$PORT
CONFIG_OVERRIDE="{\"build\":{\"devUrl\":\"http://localhost:$PORT\"}}"

echo "🚀 Starting Tauri dev with config override (Port: $PORT)..."
bun tauri dev --config "$CONFIG_OVERRIDE"
