#!/bin/bash
# Fix for blank page / EMFILE errors on macOS
# Run: ./scripts/dev.sh  or  bash scripts/dev.sh

echo "Stopping any existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 1

echo "Increasing file limit (fixes EMFILE errors)..."
ulimit -n 65536 2>/dev/null || echo "Could not set ulimit - run: ulimit -n 65536"

echo "Cleaning build cache..."
rm -rf .next

echo "Starting dev server..."
npm run dev
