# Vercel Deployment Guide

## Issues Fixed

### 1. ✅ Fixed `.gitignore` corruption
- **Problem**: `.gitignore` was corrupted with actual file paths instead of patterns
- **Fix**: Replaced with proper Next.js `.gitignore` that excludes `.next/`, `node_modules/`, etc.

### 2. ✅ Added `.vercelignore`
- **Problem**: `.next` directory was being uploaded to Vercel (causing the warning)
- **Fix**: Created `.vercelignore` to explicitly exclude build artifacts

### 3. ✅ Custom Server Incompatibility
- **Problem**: `server.ts` uses custom Node.js server with Socket.IO (not supported on Vercel serverless)
- **Fix**: Created fallback API route `/api/socketio-fallback` for serverless deployment

### 4. ✅ Build Configuration
- **Problem**: Prisma client wasn't being generated during build
- **Fix**: Updated `package.json` scripts:
  - `build`: Now runs `prisma generate && next build`
  - `postinstall`: Automatically generates Prisma client
  - `vercel-build`: Custom build command for Vercel

## Important Notes

### Socket.IO Limitation
**⚠️ Real-time WebSocket features won't work on Vercel's serverless platform.**

**Options:**
1. **For Demo/Testing**: The fallback API route provides a REST-based alternative
2. **For Production**: Deploy to a platform that supports WebSockets:
   - Railway
   - Render
   - Fly.io
   - DigitalOcean App Platform
   - AWS EC2/ECS with your custom server

### Database Limitation
**⚠️ SQLite won't work properly on Vercel (ephemeral filesystem).**

**You must use a cloud database:**
1. **Recommended Options**:
   - [Neon](https://neon.tech) - PostgreSQL (Free tier available)
   - [PlanetScale](https://planetscale.com) - MySQL (Free tier available)
   - [Supabase](https://supabase.com) - PostgreSQL (Free tier available)
   - [Turso](https://turso.tech) - SQLite-compatible (Serverless)

2. **Update Prisma Schema** (`prisma/schema.prisma`):
   ```prisma
   datasource db {
     provider = "postgresql"  // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

## Deployment Steps

### 1. Set Up Cloud Database
```bash
# Example with Neon (PostgreSQL)
# 1. Sign up at https://neon.tech
# 2. Create a new project
# 3. Copy the connection string
```

### 2. Configure Environment Variables in Vercel Dashboard
Go to your Vercel project → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-a-secure-random-string-here
NODE_ENV=production
```

### 3. Update Vercel Build Settings
In Vercel Dashboard → Settings → General:
- **Build Command**: `npm run vercel-build`
- **Install Command**: `npm install --legacy-peer-deps`
- **Output Directory**: `.next`

### 4. Deploy
```bash
# Option A: Push to GitHub (automatic deployment)
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main

# Option B: Deploy directly with Vercel CLI
npm i -g vercel
vercel --prod
```

## Verify Deployment

After deployment, check:
1. ✅ No warning about `.next` directory
2. ✅ Build completes successfully
3. ✅ All API routes work (except WebSocket features)
4. ✅ Database operations succeed

## Local vs Vercel Differences

| Feature | Local (with server.ts) | Vercel (serverless) |
|---------|------------------------|---------------------|
| Socket.IO | ✅ Full support | ❌ Not available |
| Database | SQLite (file-based) | Cloud DB required |
| Server | Custom Node.js | Serverless functions |
| Build artifacts | Local `.next/` | Generated on Vercel |

## Troubleshooting

### "You should not upload the `.next` directory" warning
- ✅ Fixed with `.gitignore` and `.vercelignore`
- Make sure to commit both files

### "Version mismatch" between local and Vercel
- Clear `.next/` folder locally: `rm -rf .next`
- Rebuild: `npm run build`
- Ensure git is tracking the correct files (not `.next/`)

### Build fails with Prisma errors
- Check `DATABASE_URL` is set in Vercel environment variables
- Verify database connection string is correct
- Ensure build command includes `prisma generate`

### Database connection fails
- SQLite won't work on Vercel - must use cloud database
- Check connection string format matches provider
- Test connection string locally first

## Recommended Architecture for Production

If you need real-time features:

```
┌─────────────────┐
│  Next.js Pages  │ ← Deploy to Vercel (UI/API routes)
│   (Serverless)  │
└────────┬────────┘
         │
         │ API calls
         ▼
┌─────────────────┐
│  Socket.IO      │ ← Deploy to Railway/Render (WebSocket server)
│  Custom Server  │
└────────┬────────┘
         │
         │ Both connect to
         ▼
┌─────────────────┐
│  Cloud Database │ ← Neon/PlanetScale/Supabase
│  (PostgreSQL)   │
└─────────────────┘
```

## Summary

✅ **Fixed Issues**:
- Corrupted `.gitignore` → Proper patterns
- Missing `.vercelignore` → Created
- Build configuration → Updated scripts
- Prisma generation → Automatic

⚠️ **Limitations**:
- Socket.IO won't work on Vercel
- SQLite must be replaced with cloud database

🚀 **Next Steps**:
1. Set up cloud database
2. Update Prisma schema
3. Configure Vercel environment variables
4. Deploy and test
