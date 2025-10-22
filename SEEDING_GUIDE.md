# Database Seeding Guide

Your deployed app doesn't have the demo data that your local version has. Here's how to fix it:

## Quick Fix

### Option 1: Use the API Endpoint (Recommended)

1. **Get your Vercel app URL** (e.g., `https://your-app.vercel.app`)

2. **Run this command:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/seed
   ```

3. **Or use PowerShell (Windows):**
   ```powershell
   .\seed-production.ps1 https://your-app.vercel.app
   ```

### Option 2: Manual Browser Request

1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Run this JavaScript:
   ```javascript
   fetch('/api/seed', { method: 'POST' })
     .then(r => r.json())
     .then(data => console.log(data))
   ```

## What Gets Seeded

The seeding process creates:

- **5 Institutions**: Stanford, MIT, Harvard, Olympic Committee, TechCorp
- **5 Students**: Alexandra Chen, Marcus Johnson, Sofia Rodriguez, David Kim, Emma Thompson
- **7 Academic Records**: Various degrees and courses
- **5 Athletic Records**: Swimming, track, tennis, basketball achievements
- **7 Certificates**: Dean's List, Olympic Trials, Research Awards, etc.
- **3 Verifications**: Sample verification records
- **Blockchain Hashes**: All records get blockchain verification

## Verification

After seeding, visit:
- `https://your-app.vercel.app/institution` - Should show Stanford University with student data
- `https://your-app.vercel.app/verify` - Should show verification options

## Troubleshooting

If seeding fails:

1. **Check Vercel Logs**: Go to your Vercel dashboard → Functions → View logs
2. **Verify Database**: Ensure `DATABASE_URL` is set in Vercel environment variables
3. **Test API**: Visit `https://your-app.vercel.app/api/seed` (should show usage info)

## Security Note

This seeding endpoint is open for demo purposes. In production, you should:
- Add authentication to the `/api/seed` endpoint
- Remove or restrict access after initial setup
- Consider using environment variables to control seeding
