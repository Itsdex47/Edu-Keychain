# Quick Fix: Vercel 404 Error

## The Problem
Your app is showing **404: NOT_FOUND** on Vercel because **SQLite doesn't work on serverless platforms**.

## The Solution (5 minutes)

### Option 1: Turso (SQLite-compatible - Easiest)

1. **Sign up**: Go to https://turso.tech (free tier)

2. **Install CLI**:
   ```bash
   npm install -g @tursodatabase/turso
   turso auth login
   ```

3. **Create database**:
   ```bash
   turso db create edu-keychain
   ```

4. **Get credentials**:
   ```bash
   turso db show edu-keychain --url
   turso db tokens create edu-keychain
   ```

5. **Update Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL`:
   ```
   libsql://[your-db-url].turso.io?authToken=[your-token]
   ```

6. **Update Prisma schema** (prisma/schema.prisma):
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   ✅ No changes needed for Turso - it's SQLite-compatible!

7. **Commit and redeploy**:
   ```bash
   git add .
   git commit -m "Add Turso database for Vercel"
   git push origin main
   ```

### Option 2: Neon (PostgreSQL - More features)

1. **Sign up**: Go to https://neon.tech

2. **Create project** and copy the connection string

3. **Update Vercel**:
   - Vercel Dashboard → Environment Variables
   - Add `DATABASE_URL`: `postgresql://...`

4. **Update Prisma schema**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. **Run migration locally**:
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Commit and redeploy**:
   ```bash
   git add .
   git commit -m "Migrate to PostgreSQL for Vercel"
   git push origin main
   ```

## Verify It Works

After deployment completes:

1. Check health endpoint: `https://your-app.vercel.app/api/health`
   - Should return: `{"message":"Good!"}`

2. Check homepage: `https://your-app.vercel.app`
   - Should load the student portal

## Still Getting 404?

### Check Build Logs
1. Vercel Dashboard → Deployments → [Latest]
2. Click "View Build Logs"
3. Look for red errors

### Check Runtime Logs
1. Vercel Dashboard → Your Project → Logs
2. Try accessing your site
3. Watch for errors in real-time

### Common Issues:
- ❌ `DATABASE_URL` not set → Add in Vercel environment variables
- ❌ `Cannot connect to database` → Check connection string format
- ❌ `Prisma Client not generated` → Ensure `postinstall` script runs

## Environment Variables Checklist

In Vercel Dashboard → Settings → Environment Variables, you need:

```
DATABASE_URL=your-database-connection-string
NODE_ENV=production
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secure-random-string-here
```

After adding variables, **you must redeploy** for them to take effect.

## Need Help?

1. Check full docs: `VERCEL_DEPLOYMENT.md`
2. Test locally first:
   ```bash
   # Set DATABASE_URL in .env
   DATABASE_URL="your-cloud-db-url"

   # Test build
   npm run build

   # Test production mode
   npm start
   ```
