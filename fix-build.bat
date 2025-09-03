@echo off
echo 🧹 Cleaning up lock files and dependencies...

:: Clean frontend
echo 📦 Cleaning frontend...
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist pnpm-lock.yaml del /q pnpm-lock.yaml
call pnpm install

:: Clean backend
echo 📦 Cleaning backend...
cd ../backend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /q package-lock.json
call npm install

:: Clean root
echo 📦 Cleaning root...
cd ..
if exist node_modules rmdir /s /q node_modules

:: Test builds
echo 🔨 Testing backend build...
cd backend
call npm run build

:: Test frontend build
echo 🔨 Testing frontend build...
cd ../frontend
call pnpm build

echo ✅ All builds successful! Ready for deployment.
pause