#!/bin/bash

# Dev startup script to launch both backend and frontend servers

echo "🚀 Starting Todo App development servers..."

# Kill any existing processes on ports 3000 and 8000
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 > /dev/null 2>&1
lsof -ti:3000 | xargs kill -9 > /dev/null 2>&1

# Activate the Python virtual environment
echo "🐍 Activating Python virtual environment..."
source .venv/bin/activate

# Start the Backend server in the background
echo "⚙️  Starting Backend server on port 8000..."
uvicorn api.main:app --reload --port 8000 --host 0.0.0.0 &

# Wait 5 seconds for the backend to wake up
echo "⏱  Waiting 5 seconds for backend to start..."
sleep 5

# Start the Frontend server in the foreground
echo "🎨 Starting Frontend server on port 3000..."
cd web-app && npm run dev