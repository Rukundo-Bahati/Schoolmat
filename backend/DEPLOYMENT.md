# Backend Deployment Guide - Render.com

## Overview
This guide will help you deploy the SchoolMart backend API on Render.com with PostgreSQL database.

## Prerequisites
- Render.com account
- GitHub repository connected to Render
- Environment variables configured

## Steps to Deploy

### 1. Connect Repository to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the repository and branch

### 2. Configure Build Settings
- **Name**: schoolmart-backend
- **Environment**: Node
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm run start:prod`
- **Root Directory**: Leave empty (uses repository root)

### 3. Set Environment Variables
Add these environment variables in the Render dashboard:

#### Database (Auto-configured from Render PostgreSQL)
- `DB_HOST` - Will be provided by Render PostgreSQL
- `DB_PORT` - Will be provided by Render PostgreSQL (usually 5432)
- `DB_USERNAME` - Will be provided by Render PostgreSQL
- `DB_PASSWORD` - Will be provided by Render PostgreSQL
- `DB_NAME` - Will be provided by Render PostgreSQL

#### JWT Configuration
- `JWT_SECRET` - Generate a secure random string (256-bit recommended)
- `JWT_EXPIRATION` - Set to `24h` or your preferred duration

#### Email Configuration (Gmail SMTP)
- `EMAIL_HOST` - `smtp.gmail.com`
- `EMAIL_PORT` - `587`
- `EMAIL_SECURE` - `false`
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Your Gmail app password (not regular password)
- `EMAIL_FROM` - `"SchoolMart <noreply@schoolmart.com>"`

#### Cloudinary (For image storage)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `CLOUDINARY_FOLDER` - `schoolmart`

#### Twilio (For SMS notifications)
- `TWILIO_ACCOUNT_SID` - Your Twilio account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio auth token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

#### Frontend URL
- `FRONTEND_URL` - Your frontend URL (e.g., `https://schoolmart-frontend.vercel.app`)

### 4. Add PostgreSQL Database
1. In Render dashboard, go to "New" → "PostgreSQL"
2. **Name**: schoolmart-db
3. **Database**: schoolmart
4. **User**: schoolmart
5. **Plan**: Starter (or higher based on needs)
6. **Region**: Same as your web service
7. Click "Create Database"

### 5. Connect Database to Web Service
1. Go to your web service settings
2. Under "Databases", click "Add Database"
3. Select the PostgreSQL database you created
4. Render will automatically set the database environment variables

### 6. Deploy
1. Click "Deploy Web Service"
2. Wait for the deployment to complete
3. The API will be available at your Render URL

### 7. Run Database Migrations (First Time)
After deployment, you need to run migrations:

#### Option 1: Using Render Shell
1. Go to your deployed service
2. Click "Shell" tab
3. Run: `cd backend && npm run migration:run`

#### Option 2: Using Local Connection
1. Get the database connection string from Render
2. Run locally: `DATABASE_URL=<your-render-db-url> npm run migration:run`

### 8. Verify Deployment
- **Health Check**: Visit `https://your-backend-url.onrender.com/health`
- **API Documentation**: Visit `https://your-backend-url.onrender.com/api`
- **Test Endpoints**: Use Swagger UI to test endpoints

## Troubleshooting

### Common Issues

#### Build Failures
- Ensure all dependencies are listed in `package.json`
- Check Node.js version compatibility
- Verify TypeScript compilation works locally

#### Database Connection Issues
- Verify environment variables are set correctly
- Check if database is in the same region as web service
- Ensure firewall rules allow connections

#### Migration Issues
- Run migrations manually if auto-migration fails
- Check migration files are committed to repository
- Verify database user has necessary permissions

### Performance Optimization
- Use connection pooling
- Enable caching where appropriate
- Monitor database query performance
- Consider upgrading plan for production use

## Security Notes
- Never commit sensitive credentials to repository
- Use Render's environment variable system
- Enable HTTPS for all endpoints
- Regularly rotate API keys and secrets
- Monitor for security vulnerabilities

## Monitoring
- Set up alerts for service health
- Monitor database performance
- Track API response times
- Set up error logging (consider Sentry or similar)

## Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] Health check endpoint working
- [ ] API documentation accessible
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Logging configured
- [ ] Backup strategy in place