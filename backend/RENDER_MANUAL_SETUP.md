# Manual Render Setup Guide

Since Render didn't auto-detect the `render.yaml`, here are the exact values to enter manually:

## 🎯 Manual Configuration Values

### Service Settings
- **Name**: `schoolmart-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` or your preferred region
- **Branch**: `main` (or your deployment branch)

### Build Settings
- **Root Directory**: Leave empty (uses repository root)
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm run start:prod`

### Instance Settings
- **Plan**: `Free` (or Starter/Standard for production)
- **Port**: `4000` (or leave empty to auto-detect)

### Environment Variables
Copy these key-value pairs:

#### Required Variables
```
NODE_ENV=production
PORT=4000
JWT_EXPIRES_IN=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
CLOUDINARY_FOLDER=schoolmart
```

#### Variables to Set Later (in Render Dashboard)
```
JWT_SECRET=your-secure-jwt-secret-here
DB_HOST=auto-from-postgres
DB_PORT=5432
DB_USERNAME=auto-from-postgres
DB_PASSWORD=auto-from-postgres
DB_NAME=auto-from-postgres
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
FRONTEND_URL=https://your-frontend-url.com
```

### Database Setup
1. **Add Database**: Click "Add Database" → "PostgreSQL"
2. **Database Name**: `schoolmart-db`
3. **Database**: `schoolmart`
4. **User**: `schoolmart`
5. **Plan**: `Free` (or Starter for production)
6. **Region**: Same as your web service

### Health Check
- **Health Check Path**: `/health`

### Final Steps
1. Click "Create Web Service"
2. After deployment, go to "Shell" tab and run: `cd backend && npm run migration:run`
3. Your API will be available at: `https://schoolmart-backend-xxxxx.onrender.com`
4. API docs at: `https://schoolmart-backend-xxxxx.onrender.com/api`

## 🚨 Common Manual Setup Issues

### Build Command Errors
If build fails, try:
- `cd backend && npm ci --production=false && npm run build`
- Or: `cd backend && npm install && npm run build`

### Port Issues
- Ensure `PORT` env var is set to `4000`
- Check `main.ts` uses `process.env.PORT || 4000`

### Database Connection
- Ensure PostgreSQL is added to the same service
- Check that database env vars are auto-populated

### Quick Test After Deployment
```bash
curl https://your-backend-url.onrender.com/health
```