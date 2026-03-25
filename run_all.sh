#!/bin/bash

# Define what happens when we press Ctrl+C
cleanup() {
    echo -e "\n🛑 Shutting down AI Engine and Frontend..."
    kill $BACKEND_PID
    exit
}

# Trap the SIGINT (Ctrl+C) signal and route it to our cleanup function
trap cleanup SIGINT

echo "🚀 Starting NXT-GEN SKILLFORGE (Git Bash)..."

# 1. Start the Python AI Engine in the background (the '&' does this)
echo "[1/2] Launching Python AI Engine (Port 8000)..."
cd ai-engine || exit
source venv/Scripts/activate
uvicorn main:app --reload &
BACKEND_PID=$!  # Save the process ID so we can kill it later
cd ..

# 2. Give the AI Engine 3 seconds to boot up
sleep 3

# 3. Start the Next.js Frontend
echo "[2/2] Launching Next.js Frontend (Port 3000)..."
npm run dev

# Wait for the background process to prevent the script from exiting early
wait $BACKEND_PID