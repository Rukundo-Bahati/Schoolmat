# SchoolMart Deployment Guide

This guide will help you deploy your SchoolMart application with the frontend on Vercel (free tier) and backend + database on Render (free tier).

## Prerequisites

1. **GitHub Account**: You'll need to push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **Cloudinary Account**: Already configured for image uploads

## 🚀 Quick Deployment Steps

### Step 1: Push Code to GitHub

```bash
# Create a new repository on GitHub first, then:
git init
git add .
git commit -m "Initial commit - SchoolMart deployment ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. **Go to [render.com](https://render.com)** and sign in
2. **Click "New" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the backend service**:
   - **Name**: `schoolmart-backend`
   - **Environment**: `Node`
   - **Region**: Oregon (for free tier)
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm run start:prod`
   - **Instance Type**: Free

5. **Add Environment Variables** (copy from `.env.production`):
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - Add all your production environment variables from the table below

6. **Add PostgreSQL Database**:
   - Click "New" → "PostgreSQL"
   - **Name**: `schoolmart-db`
   - **Database**: `schoolmart`
   - **User**: `schoolmart`
   - **Plan**: Free
   - **Region**: Oregon

7. **Connect Database to Backend**:
   - In your backend service settings, add the database connection variables automatically provided by Render

### Step 3: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the frontend**:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://schoolmart-backend.onrender.com`

6. **Deploy**

### Step 4: Update Backend URL

After Render deployment is complete:
1. Copy your Render backend URL (e.g., `https://schoolmart-backend.onrender.com`)
2. Update the `NEXT_PUBLIC_API_URL` in Vercel to match your actual Render URL

## 📋 Environment Variables Reference

### Backend Environment Variables (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | Auto from Render |
| `DB_PORT` | Database port | Auto from Render |
| `DB_USERNAME` | Database user | Auto from Render |
| `DB_PASSWORD` | Database password | Auto from Render |
| `DB_NAME` | Database name | Auto from Render |
| `JWT_SECRET` | JWT signing key | Generate secure |
| `JWT_EXPIRES_IN` | Token expiration | 24h |
| `EMAIL_USER` | Gmail address | your-email@gmail.com |
| `EMAIL_PASS` | App password | your-gmail-app-password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud | dwk1eq0om |
| `CLOUDINARY_API_KEY` | Cloudinary key | your-cloudinary-api-key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | your-cloudinary-api-secret |
| `TWILIO_ACCOUNT_SID` | Twilio SID | your-twilio-account-sid |
| `TWILIO_AUTH_TOKEN` | Twilio token | your-twilio-auth-token |
| `TWILIO_PHONE_NUMBER` | Twilio number | your-twilio-phone-number |

### Frontend Environment Variables (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | https://schoolmart-backend.onrender.com |

## 🔧 Configuration Files

### Files Created/Updated

1. **vercel.json** - Vercel deployment configuration
2. **render.yaml** - Render deployment configuration
3. **backend/.env.production** - Production environment variables template
4. **frontend/.env.production** - Production frontend variables
5. **backend/src/main.ts** - Updated for production deployment

### Important Notes

- **Free Tier Limits**:
  - Render: 512MB RAM, 100GB bandwidth/month, sleeps after 15 minutes
  - Vercel: 100GB bandwidth/month, 10-second cold starts
  - Database: 1GB storage, shared CPU

- **Cold Start Handling**:
  - Add a ping service (like cron-job.org) to keep your backend awake
  - Frontend will handle loading states gracefully

- **Security**:
  - Never commit actual secrets to GitHub
  - Use environment variables for all sensitive data
  - Enable HTTPS on both services (automatic)

## 🧪 Testing After Deployment

1. **Backend Health Check**:
   ```
   https://schoolmart-backend.onrender.com/health
   ```

2. **API Documentation**:
   ```
   https://schoolmart-backend.onrender.com/api
   ```

3. **Frontend**:
   ```
   https://schoolmart-frontend.vercel.app
   ```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Issues**: Ensure your backend CORS configuration matches your Vercel URL
2. **Database Connection**: Check Render database connection variables
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **Build Failures**: Ensure all dependencies are in package.json

### Debug Commands

```bash
# Check backend logs on Render
# Go to Render dashboard → Logs tab

# Check frontend build logs on Vercel
# Go to Vercel dashboard → Deployments → View build logs
```

## 📞 Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Issues**: Check deployment logs in respective dashboards

## 🔄 Updates

When making changes:
1. Push to GitHub main branch
2. Both Render and Vercel will auto-deploy
3. Check deployment status in dashboards
4. Monitor for any build failures

---

**Happy Deploying! 🚀**