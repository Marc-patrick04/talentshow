# Vercel Deployment Guide

## Complete Setup Instructions

### Step 1: Set up Supabase Database
1. Follow the instructions in `supabase-setup.md` to:
   - Create a Supabase account
   - Set up the database schema
   - Get your database connection string

### Step 2: Prepare Your Project
Your project now includes:
- `vercel-server.js` - Server configured for Supabase
- `vercel.json` - Vercel deployment configuration
- `supabase-setup.md` - Database setup guide

### Step 3: Deploy to Vercel

#### Option A: Deploy from Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in and click "New Project"
3. Connect to your GitHub repository (or upload files)
4. Configure project settings:
   - Framework Preset: `Other`
   - Root Directory: `/` (root)
5. Add Environment Variables:
   ```
   DATABASE_URL=your_supabase_connection_string_here
   NODE_ENV=production
   ```
6. Click "Deploy"

#### Option B: Deploy using Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Login:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Add environment variables when prompted:
   ```
   DATABASE_URL: your_supabase_connection_string_here
   NODE_ENV: production
   ```

### Step 4: Configure Environment Variables in Vercel
After deployment, go to your project settings in Vercel:
1. Settings → Environment Variables
2. Add:
   - `DATABASE_URL`: Your Supabase connection string
   - `NODE_ENV`: `production`

### Step 5: Test Your Deployment
1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test the form submission
3. Check the admin dashboard

## Troubleshooting

### Common Issues:
1. **Database Connection Error**: Check your `DATABASE_URL` environment variable
2. **CORS Issues**: Vercel handles CORS automatically, but ensure your frontend URL is correct
3. **SSL Certificate**: Supabase requires SSL, which is configured in `vercel-server.js`

### Testing Locally with Supabase:
```bash
# Set environment variable
export DATABASE_URL="your_supabase_connection_string"

# Run with Vercel server
npm run vercel-dev
```

## Security Notes:
- Never commit your `DATABASE_URL` to version control
- Use Vercel's environment variables for sensitive data
- Supabase provides automatic SSL encryption

## Monitoring:
- Vercel provides built-in analytics and error monitoring
- Supabase has a dashboard for database monitoring
- Check the logs in Vercel dashboard for any issues

## Cost:
