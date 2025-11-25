# Deployment Guide - Vercel + Supabase

## Prerequisites
- GitHub account
- Vercel account (free)
- Supabase project set up (from SUPABASE_SETUP.md)

## Step 1: Prepare Environment Variables

Make sure your `.env` file has the correct Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Setup Supabase and Vercel deployment"
git push origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Website (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your `flashh-card` repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
6. Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

7. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? flashh-card
# - In which directory is your code located? ./frontend
# - Want to override settings? Yes
# - Build Command? npm run build
# - Output Directory? dist
# - Development Command? npm run dev

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase anon key

# Deploy to production
vercel --prod
```

## Step 4: Verify Deployment

1. Vercel will provide you with a URL (e.g., `flashh-card.vercel.app`)
2. Visit the URL
3. Test adding a quote with image
4. Check Supabase dashboard to verify data is saved

## Automatic Deployments

Once connected, Vercel will automatically:
- Deploy every push to `main` branch to production
- Create preview deployments for pull requests

## Troubleshooting

### App shows "Error: An error occurred"
- Check browser console for errors
- Verify environment variables are set in Vercel dashboard
- Make sure Supabase database table and storage bucket are created

### Images not uploading
- Verify Supabase storage bucket `quote-images` is public
- Check storage policies are set correctly

### Build fails
- Check that `package.json` has all dependencies
- Verify build command in Vercel settings: `npm run build`
- Check build logs in Vercel dashboard

## Update Environment Variables

In Vercel dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Edit or add new variables
4. Redeploy for changes to take effect

## Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Monitoring

- View deployment logs in Vercel dashboard
- Monitor errors in browser console
- Check Supabase dashboard for database activity
