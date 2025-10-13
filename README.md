# SchoolMart - Complete Local Development Guide

A comprehensive e-commerce platform for school supplies with separate frontend (Next.js) and backend (NestJS) applications.

<img width="1600" height="749" alt="image" src="https://github.com/user-attachments/assets/7b6b5c53-3189-4d5f-a7e5-8f402ab4f72a" />


## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18.17.0 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **pnpm** (Package manager) - Install with: `npm install -g pnpm`
- **Git** - [Download here](https://git-scm.com/downloads)

### Optional but Recommended
- **VS Code** (with extensions: ESLint, Prettier, PostgreSQL)
- **Postman** or **Insomnia** (for API testing)
- **pgAdmin** (PostgreSQL GUI client)

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd schoolmart
```

### 2. Database Setup

#### Install PostgreSQL
1. Download and install PostgreSQL from the official website
2. During installation, remember your **postgres user password**
3. Default port: `5432`

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE schoolmart;

# Create user (optional, can use postgres user)
CREATE USER schoolmart_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE schoolmart TO schoolmart_user;

# Exit
\q
```

### 3. Backend Setup (NestJS)

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your configuration:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=schoolmart

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="SchoolMart <noreply@schoolmart.com>"

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CLOUDINARY_FOLDER=schoolmart

# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Social Login Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACACEBOOK_REDIRECT_URI=http://localhost:4000/auth/facebook/callback
```

#### Database Migration
```bash
# Generate initial migration
npm run migration:generate -- -n InitialSchema

# Run migrations
npm run migration:run

# Check migration status
npm run migration:show
```

#### Start Backend Server
```bash
# Development mode with hot reload
npm run dev

# Or production mode
npm run build
npm run start:prod
```

Backend will be available at: `http://localhost:4000`
- API Documentation: `http://localhost:4000/api`
- Health Check: `http://localhost:4000/health`

### 4. Frontend Setup (Next.js)

#### Navigate to frontend directory
```bash
cd ../frontend
```

#### Install dependencies
```bash
pnpm install
```

#### Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` file:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### Start Frontend Server
```bash
# Development mode
pnpm dev

# Build for production
pnpm build
pnpm start
```

Frontend will be available at: `http://localhost:3000`

## Development Workflow

### Running Both Servers Simultaneously

#### Option 1: Two Terminal Windows
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

#### Option 2: Concurrently (if configured)
```bash
# From root directory (if you have concurrently setup)
npm run dev:all
```

### Database Management

#### Reset Database (Development)
```bash
cd backend
npm run migration:revert  # Revert last migration
npm run migration:run     # Re-run all migrations
```

#### Seed Database (Optional)
```bash
# Create seed script or use existing data
# Example: Create seed.ts file and run
npm run seed
```

### API Testing

#### Using Swagger UI
1. Start backend server
2. Visit: `http://localhost:4000/api`
3. Test endpoints directly from the interface

#### Using Postman
1. Import the API collection (create from Swagger docs)
2. Set base URL: `http://localhost:4000`
3. Include authentication tokens in headers

## Project Structure

```
schoolmart/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order processing
│   │   ├── users/          # User management
│   │   ├── cart/           # Shopping cart
│   │   ├── payments/       # Payment processing
│   │   ├── uploads/        # File upload handling
│   │   └── migrations/     # Database migrations
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/               # Next.js Application
│   ├── app/               # Next.js 13+ app directory
│   │   ├── products/       # Product pages
│   │   ├── cart/           # Shopping cart
│   │   ├── login/          # Authentication
│   │   └── register/       # User registration
│   ├── components/         # Reusable components
│   ├── lib/               # Utility functions
│   └── public/            # Static assets
├── render.yaml            # Render deployment config
├── vercel.json            # Vercel deployment config
└── README.md
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
```bash
# Error: Connection refused
# Solution: Ensure PostgreSQL is running
sudo systemctl start postgresql    # Linux
brew services start postgresql     # macOS
```

#### 2. Port Already in Use
```bash
# Find process using port 4000
lsof -i :4000    # macOS/Linux
netstat -ano | findstr :4000    # Windows

# Kill process
kill -9 <PID>    # macOS/Linux
taskkill /PID <PID> /F    # Windows
```

#### 3. Migration Issues
```bash
# If migrations fail
npm run migration:revert
npm run migration:run

# Check database connection
npm run typeorm schema:log
```

#### 4. Node Version Issues
```bash
# Check Node version
node --version

# Use nvm to switch versions (if using nvm)
nvm use 18
```

#### 5. Package Manager Issues
```bash
# Clear cache
npm cache clean --force
pnpm store prune

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 6. CORS Issues
- Ensure frontend `.env.local` has correct API URL
- Check backend CORS configuration in `main.ts`

### Email Configuration Issues

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use app password in EMAIL_PASS

#### Testing Email
```bash
# Test email configuration
curl -X POST http://localhost:4000/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Image Upload Issues

#### Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com)
2. Get credentials from dashboard
3. Set environment variables

#### Testing Upload
```bash
# Test Cloudinary configuration
cd backend
npm run verify:cloudinary
```

## Development Tools

### Database GUI
- **pgAdmin** (recommended)
- **DBeaver**
- **TablePlus**

### API Testing
- **Postman** (recommended)
- **Insomnia**
- **Thunder Client** (VS Code extension)

### Browser Dev Tools
- **React DevTools** extension
- **Redux DevTools** (if using Redux)

## Production Deployment

### Environment Variables Checklist
Before deploying, ensure all environment variables are set:

#### Backend (.env)
- [ ] Database credentials
- [ ] JWT secret
- [ ] Email configuration
- [ ] Cloudinary credentials
- [ ] Twilio credentials
- [ ] Social login credentials

#### Frontend (.env.local)
- [ ] API URL updated to production backend

### Build Commands
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
pnpm build
```

## Support

If you encounter issues:

1. Check this README troubleshooting section
2. Verify all prerequisites are installed
3. Check environment variables are correctly set
4. Review server logs for error messages
5. Ensure database is running and accessible

## Additional Notes

- **Development Mode**: Uses hot reload for both frontend and backend
- **Database**: PostgreSQL with TypeORM migrations
- **Authentication**: JWT tokens with refresh tokens
- **File Uploads**: Cloudinary for image storage
- **Email**: SMTP with Nodemailer
- **SMS**: Twilio for notifications
- **Social Login**: Google and Facebook OAuth

For detailed API documentation, visit `http://localhost:4000/api` when the backend is running.
