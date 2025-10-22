# 🚀 Quick Fix: Seed Your Turso Database

Your Vercel app is empty because the Turso database hasn't been seeded with demo data. Here's how to fix it:

## Method 1: Interactive Script (Recommended)

**For Windows:**
```bash
.\seed-turso.bat
```

**For PowerShell:**
```powershell
.\seed-turso.ps1
```

## Method 2: Direct Command

```bash
npx tsx seed-turso.ts "libsql://your-database-url.turso.io" "your-auth-token"
```

## What You Need

1. **Turso Database URL** - Looks like: `libsql://your-db-name.turso.io`
2. **Turso Auth Token** - Your authentication token (optional but recommended)

## How to Get Your Credentials

### Option A: From Turso Dashboard
1. Go to [Turso Dashboard](https://turso.tech)
2. Select your database
3. Copy the connection URL
4. Generate an auth token if needed

### Option B: From Turso CLI
```bash
# Get database URL
turso db show your-db-name --url

# Create auth token
turso db tokens create your-db-name
```

## What Gets Seeded

The script will create:
- ✅ **5 Institutions** (Stanford, MIT, Harvard, Olympic Committee, TechCorp)
- ✅ **5 Students** with complete profiles
- ✅ **7 Academic Records** (degrees, courses)
- ✅ **5 Athletic Records** (sports achievements)
- ✅ **7 Certificates** (awards, honors)
- ✅ **3 Verifications** (sample verifications)
- ✅ **Blockchain hashes** for all records

## After Seeding

1. **Visit your Vercel app**: `https://your-app.vercel.app/institution`
2. **Should show**: Stanford University with student data
3. **Verify page**: `https://your-app.vercel.app/verify` should work

## Troubleshooting

**If seeding fails:**

1. **Check URL format**: Must start with `libsql://`
2. **Verify auth token**: Should be valid and not expired
3. **Test connection**: Try accessing your Turso dashboard
4. **Check logs**: The script shows detailed progress

**Common errors:**
- `Invalid URL` → Check your database URL format
- `Authentication failed` → Verify your auth token
- `Connection timeout` → Check internet connection

## Security Note

This seeding script is safe to run multiple times - it clears existing data first, so you won't get duplicates.

---

**Need help?** The script provides detailed error messages and troubleshooting tips.
