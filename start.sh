#!/bin/bash

# Start FastAPI in background using our smart port script
echo "Starting FastAPI Backend..."
python run.py &

# Start Next.js Frontend
echo "Starting Next.js Frontend..."
npm run start
