# .env File Setup Guide for Render

## 🎯 Using .env File with Render

### Step 1: Prepare Your .env File
The `.env.production` file is already created with all necessary variables. You have two options:

#### Option A: Upload .env File (Recommended)
1. **Rename** `.env.production` to `.env`
2. **Replace all placeholder values** with your actual production values
3. **Upload** the file in Render's Environment Variables section

#### Option B: Copy Variables Manually
Copy each variable from `.env.production` to Render's dashboard

### Step 2: Required Values to Replace

Replace these placeholders with your actual values:

```bash
# Database (from Render PostgreSQL)
DB_HOST=your-render-db-host
DB_PORT=5432
DB_USERNAME=your-render-db-user
DB_PASSWORD=your-render-db-password
DB_NAME=your-render-db-name

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-256-bit-secret-key-here-change-this

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
CORS_ORIGIN=https://your-actual-frontend-url.vercel.app

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-url.onrender.com/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=https://your-backend-url.onrender.com/auth/facebook/callback
```

### Step 3: How to Upload .env File in Render

1. **Go to your Render service dashboard**
2. **Navigate to Environment tab**
3. **Click "Import from .env file"**
4. **Upload your `.env` file**
5. **Review and save**

### Step 4: Quick Setup Script

Create a `.env` file from `.env.production`:

```bash
# Copy and edit
cp backend/.env.production backend/.env
# Then edit backend/.env with your actual values
```

### Step 5: Essential Values Checklist

**Required for basic functionality:**
- [ ] `DB_HOST` (from Render PostgreSQL)
- [ ] `DB_PASSWORD` (from Render PostgreSQL)
- [ ] `JWT_SECRET` (generate strong random string)
- [ ] `EMAIL_USER` (your Gmail)
- [ ] `EMAIL_PASS` (Gmail app password)
- [ ] `FRONTEND_URL` (your deployed frontend URL)

**Required for image uploads:**
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`

**Required for SMS notifications:**
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`

### Step 6: Generate JWT Secret

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 7: Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-factor authentication
3. Create App Password for "Mail"
4. Use this as `EMAIL_PASS`

### Example Complete .env File

```bash
# Database
DB_HOST=dpg-cq1234567890abcdefg-a.oregon-postgres.render.com
DB_PORT=5432
DB_USERNAME=schoolmart_user
DB_PASSWORD=your-actual-db-password
DB_NAME=schoolmart_db

# JWT
JWT_SECRET=4f8a9b2c3d4e5f6789abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM="SchoolMart <noreply@schoolmart.com>"

# Frontend
FRONTEND_URL=https://schoolmart-frontend.vercel.app
CORS_ORIGIN=https://schoolmart-frontend.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=demo-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-actual-secret
CLOUDINARY_FOLDER=schoolmart

# Twilio
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef12
TWILIO_AUTH_TOKEN=your-actual-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Security Notes
- Never commit the actual `.env` file with real values
- Always use strong, unique passwords
- Rotate secrets regularly
- Use environment-specific values