# Vercel Frontend Deployment Guide

## 🚀 Deploy Schoolmart Frontend to Vercel

This guide will help you deploy the frontend folder to Vercel with the custom domain `https://schoolmart.vercel.app`.

### 📋 Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository connected to your project
- Backend deployed on Render (already configured)

### 🔧 Step-by-Step Deployment

#### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

#### 2. Deploy via Vercel Dashboard (Recommended)

**Method 1: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Configure the following settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://schoolmart-backend.onrender.com/api
   ```

6. Click "Deploy"

#### 3. Configure Custom Domain

After deployment:
1. Go to your project dashboard
2. Navigate to "Settings" → "Domains"
3. Add `schoolmart.vercel.app` as the domain
4. Vercel will automatically assign it if available

#### 4. Environment Variables Setup

In Vercel Dashboard:
1. Go to "Settings" → "Environment Variables"
2. Add:
   - `NEXT_PUBLIC_API_URL`: `https://schoolmart-backend.onrender.com/api`

### 📁 Files Configured
- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ `frontend/.env.production` - Production environment variables
- ✅ `frontend/package.json` - Build scripts configured

### 🔄 Automatic Deployments
- Every push to the `main` branch will trigger a new deployment
- Pull request previews are enabled by default

### 🛠️ Manual CLI Deployment (Alternative)
```bash
cd frontend
vercel --prod
```

### 📞 Troubleshooting

**Build Fails?**
- Ensure all dependencies are listed in `package.json`
- Check that `NEXT_PUBLIC_API_URL` is correctly set
- Verify pnpm is used (not npm/yarn)

**Domain Issues?**
- Contact Vercel support if `schoolmart.vercel.app` is taken
- Consider alternative domains like `schoolmart-app.vercel.app`

### ✅ Success Checklist
- [ ] Frontend deployed successfully
- [ ] Custom domain configured
- [ ] Environment variables set
- [ ] API connection to backend working
- [ ] All pages loading correctly