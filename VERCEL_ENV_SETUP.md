# Vercel Environment Variables Setup

Your Turso database is seeded, but Vercel needs the environment variables to connect to it.

## 🔧 **Required Environment Variables**

Go to your **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables** and add:

### 1. DATABASE_URL
```
libsql://edu-keychain-itsdex47.aws-ap-south-1.turso.io
```

### 2. TURSO_AUTH_TOKEN
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjExNDY1MjEsImlkIjoiYjc2NzFhNjgtZmM4Ni00ODlmLWIwMDItOWUwYjUzNjc0ZTIwIiwicmlkIjoiMmMyNjgyNDEtMjQ5MS00MTU5LWI0M2QtNjFiZTAyNzU4YzdjIn0.YGeid_QxqbDWlBmHvfFciwkPyTQVv0foNnDk62IdqLZ9eaYl-HuK0hRjVB0OcBdHr-SLOIYA440FrcM43a2eAQ
```

### 3. NODE_ENV
```
production
```

## 🚀 **Steps to Fix**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Add Environment Variables**
   - Click **Settings** tab
   - Click **Environment Variables** in the sidebar
   - Add each variable above

3. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Or push a new commit to trigger redeployment

## 🔍 **Verify It's Working**

After redeployment, test these endpoints:

1. **Health Check**: `https://your-app.vercel.app/api/health`
2. **Institutions**: `https://your-app.vercel.app/api/institutions`
3. **Students**: `https://your-app.vercel.app/api/students`

## 🐛 **Troubleshooting**

If it still doesn't work:

1. **Check Build Logs**
   - Vercel Dashboard → Deployments → [Latest] → View Build Logs
   - Look for database connection errors

2. **Test Database Connection**
   - Run: `npx tsx test-connection.ts "libsql://edu-keychain-itsdex47.aws-ap-south-1.turso.io" "your-token"`

3. **Check Environment Variables**
   - Make sure they're set for **Production** environment
   - Variables are case-sensitive

## 📝 **Alternative: Use Combined URL**

Instead of separate `DATABASE_URL` and `TURSO_AUTH_TOKEN`, you can use:

```
DATABASE_URL=libsql://edu-keychain-itsdex47.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjExNDY1MjEsImlkIjoiYjc2NzFhNjgtZmM4Ni00ODlmLWIwMDItOWUwYjUzNjc0ZTIwIiwicmlkIjoiMmMyNjgyNDEtMjQ5MS00MTU5LWI0M2QtNjFiZTAyNzU4YzdjIn0.YGeid_QxqbDWlBmHvfFciwkPyTQVv0foNnDk62IdqLZ9eaYl-HuK0hRjVB0OcBdHr-SLOIYA440FrcM43a2eAQ
```

This combines both the URL and auth token in one variable.
