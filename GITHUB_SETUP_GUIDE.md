# GitHub Repository Setup Guide

This guide will help you push both frontend and backend to the same GitHub repository.

## Current Structure Analysis

Your project structure:
```
schoolmart/
├── frontend/          (Next.js - already on GitHub)
├── backend/           (NestJS - needs to be added)
├── README.md
├── vercel.json
├── render.yaml
└── other root files
```

## Step 1: Check Current Git Status

Open your terminal in the root `schoolmart` directory and check the current status:

```bash
# Check if you're in the right directory
cd e:/Projects/NEXT/schoolmart

# Check current git status
git status

# Check remote repository
git remote -v
```

## Step 2: Prepare Backend for Git

### 2.1 Create .gitignore for Backend

Create a `.gitignore` file in the `backend/` directory:

```bash
# Create backend .gitignore
cat > backend/.gitignore << EOF
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.tmp
.temp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
EOF
```

### 2.2 Remove sensitive files from tracking

```bash
# Check if backend has any tracked sensitive files
cd backend
git ls-files | grep -E "(\.env|node_modules|dist)"

# If any sensitive files are tracked, untrack them
git rm --cached .env 2>/dev/null || true
git rm -r --cached node_modules 2>/dev/null || true
git rm -r --cached dist 2>/dev/null || true
```

## Step 3: Create Monorepo Structure

### 3.1 Update Root .gitignore

Add backend-specific entries to your root `.gitignore`:

```bash
# Add to existing .gitignore
cat >> .gitignore << EOF

# Backend specific
/backend/.env
/backend/.env.local
/backend/.env.production
/backend/dist
/backend/node_modules
/backend/logs
/backend/*.log
/backend/coverage
/backend/.nyc_output
/backend/.tmp
/backend/.temp
/backend/report.*.json
EOF
```

### 3.2 Create Root-level package.json (Optional)

Create a root `package.json` for workspace management:

```bash
# Create root package.json
cat > package.json << EOF
{
  "name": "schoolmart",
  "version": "1.0.0",
  "description": "SchoolMart - School Supplies E-commerce Platform",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && pnpm dev",
    "dev:backend": "cd backend && npm run start:dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && pnpm build",
    "build:backend": "cd backend && npm run build",
    "install:all": "npm install && cd frontend && pnpm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF
```

## Step 4: Add Backend to Git Repository

### 4.1 Add Backend Files

```bash
# Navigate to project root
cd e:/Projects/NEXT/schoolmart

# Add backend directory to git
git add backend/

# Check what's being added
git status

# Commit the backend addition
git commit -m "feat: add NestJS backend to monorepo structure"
```

### 4.2 Verify Structure

```bash
# Check git status for both directories
git status

# List files to verify structure
ls -la
ls -la frontend/
ls -la backend/
```

## Step 5: Push to GitHub

### 5.1 Push Changes

```bash
# Push to the existing repository
git push origin main

# If you're on a different branch
# git push origin <your-branch-name>
```

### 5.2 Verify on GitHub

1. Go to your GitHub repository
2. Check that both `frontend/` and `backend/` directories are visible
3. Verify that sensitive files like `.env` are not present
4. Check that `node_modules` directories are not present

## Step 6: Update GitHub Repository Settings

### 6.1 Update Repository Description

Update your GitHub repository description to reflect the monorepo:

```
SchoolMart - School Supplies E-commerce Platform

Monorepo containing:
- Frontend: Next.js 14 application with TypeScript
- Backend: NestJS API with PostgreSQL
- Deployment: Vercel (frontend) + Render (backend)
```

### 6.2 Add Topics/Tags

Add relevant topics to your repository:
- `nextjs`
- `nestjs`
- `typescript`
- `postgresql`
- `ecommerce`
- `monorepo`
- `school-supplies`

## Step 7: Environment Variables Setup

### 7.1 Create Environment Templates

Create environment templates for both environments:

```bash
# Create frontend environment template
cp frontend/.env.example frontend/.env.local.template

# Create backend environment template
cp backend/.env.example backend/.env.local.template
```

### 7.2 Add Environment Setup Instructions

Add to your root `README.md`:

```markdown
## Environment Setup

### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
```

### Backend Environment
```bash
cd backend
cp .env.example .env.local
# Edit .env.local with your values
```
```

## Step 8: Verification Steps

### 8.1 Test Local Development

```bash
# Test frontend
cd frontend && pnpm dev

# In another terminal, test backend
cd backend && npm run start:dev
```

### 8.2 Test Build

```bash
# Test frontend build
cd frontend && pnpm build

# Test backend build
cd backend && npm run build
```

## Troubleshooting

### Issue: Large file sizes
If you have issues with large files:

```bash
# Check file sizes
du -sh backend/node_modules frontend/node_modules

# Ensure .gitignore is working correctly
git check-ignore backend/node_modules
```

### Issue: Existing repository conflicts
If you have conflicts with existing repository:

```bash
# Backup your current work
cp -r e:/Projects/NEXT/schoolmart e:/Projects/NEXT/schoolmart-backup

# Re-clone the repository
git clone <your-repo-url> schoolmart-new
cd schoolmart-new

# Copy your work to the new clone
cp -r ../schoolmart-backup/backend ./
cp -r ../schoolmart-backup/frontend ./

# Add and commit
git add .
git commit -m "feat: complete monorepo setup with frontend and backend"
git push origin main
```

## Next Steps

After successfully pushing both frontend and backend:

1. **Set up GitHub Actions** for CI/CD
2. **Configure branch protection** rules
3. **Set up code review** processes
4. **Update deployment configurations** (Vercel and Render)
5. **Create issue templates** for bug reports and feature requests

## Quick Commands Summary

```bash
# Complete setup in one go
cd e:/Projects/NEXT/schoolmart

# Add backend .gitignore
cat > backend/.gitignore << EOF
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*

# Environment
.env
.env.local
.env.production

# Runtime
.pids
*.pid
*.seed
*.pid.lock

# Coverage
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.sublime-workspace

# OS
.DS_Store
Thumbs.db
EOF

# Add to git
git add backend/
git commit -m "feat: add NestJS backend to monorepo"
git push origin main
```

This completes the setup for pushing both frontend and backend to the same GitHub repository!