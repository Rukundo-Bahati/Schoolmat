# Build Troubleshooting Guide - Render Deployment

## Issue Analysis

The build is failing due to a **React version conflict** in the frontend dependencies. The error indicates:

- **Root Cause**: Frontend has `react@19.1.1` but `@remix-run/react@2.17.0` requires `react@^18.0.0`
- **Secondary Issue**: Render is detecting the monorepo structure and trying to install dependencies from the root level

## Solutions Implemented

### 1. Fixed Frontend Dependencies ✅
- **Downgraded React** from `^19` to `^18.2.0` for compatibility
- **Removed conflicting packages**:
  - `@remix-run/react` (was causing the peer dependency conflict)
  - `@sveltejs/kit`, `svelte`, `vue`, `vue-router` (not needed for Next.js)
- **Updated type definitions** to match React 18

### 2. Updated Render Configuration ✅
- **Added `rootDir: backend`** to focus only on backend directory
- **Changed `buildCommand`** to use relative paths from backend directory
- **Added `.renderignore`** to exclude frontend from backend build

## Manual Deployment Steps (Recommended)

Since Render might not auto-detect the monorepo structure correctly, use manual setup:

### Backend Only Deployment
1. **Connect Repository** in Render Dashboard
2. **Manual Configuration**:
   - **Service Type**: Web Service
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Port**: `4000`

### Environment Variables (Backend)
```bash
# Database (auto-populated from PostgreSQL)
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=schoolmart

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Email (Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Alternative Solutions

### Option 1: Separate Repositories
- Move backend to separate repository
- Deploy backend independently
- Deploy frontend (Vercel) and backend (Render) separately

### Option 2: Frontend Deployment (Vercel)
Since frontend uses Next.js with pnpm:

1. **Deploy to Vercel** (recommended for Next.js)
2. **Set Environment Variables**:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

### Option 3: Clean Install
If issues persist:

```bash
# Clean all lock files and node_modules
rm -rf frontend/node_modules frontend/pnpm-lock.yaml
rm -rf backend/node_modules backend/package-lock.json
rm -rf node_modules

# Reinstall dependencies
cd frontend && pnpm install
cd ../backend && npm install
```

## Verification Steps

1. **Test Backend Build Locally**:
   ```bash
   cd backend
   npm ci
   npm run build
   ```

2. **Test Frontend Build Locally**:
   ```bash
   cd frontend
   pnpm install
   pnpm build
   ```

3. **Deploy Backend to Render** with manual configuration

4. **Deploy Frontend to Vercel** (if using separate deployment)

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| React version conflict | Fixed in frontend/package.json |
| Monorepo detection | Use `rootDir: backend` in render.yaml |
| pnpm vs npm | Backend uses npm, frontend uses pnpm |
| Lock file conflicts | Remove and regenerate lock files |

## Next Steps

1. **Commit the changes** to your repository
2. **Use manual setup** in Render Dashboard
3. **Set up PostgreSQL database** in Render
4. **Configure environment variables**
5. **Deploy backend first**
6. **Deploy frontend to Vercel** (recommended)

The React version conflict has been resolved, and the render.yaml has been updated to focus on backend-only deployment.