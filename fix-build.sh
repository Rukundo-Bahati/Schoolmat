#!/bin/bash

echo "🧹 Cleaning up lock files and dependencies..."

# Clean frontend
echo "📦 Cleaning frontend..."
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clean backend
echo "📦 Cleaning backend..."
cd ../backend
rm -rf node_modules package-lock.json
npm install

# Clean root
echo "📦 Cleaning root..."
cd ..
rm -rf node_modules

# Test builds
echo "🔨 Testing backend build..."
cd backend
npm run build

# Test frontend build
echo "🔨 Testing frontend build..."
cd ../frontend
pnpm build

echo "✅ All builds successful! Ready for deployment."