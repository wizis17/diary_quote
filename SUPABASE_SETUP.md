# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `flashh-card`
   - Database password: (create a strong password)
   - Region: Choose closest to you
5. Wait for the project to be created

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

3. Update your `.env` file:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 3: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste this SQL and click "Run":

```sql
-- Create quotes table
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  meaning TEXT NOT NULL,
  imageUrl TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations" ON quotes
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Step 4: Create Storage Bucket for Images

1. Go to **Storage** in the left menu
2. Click "Create a new bucket"
3. Name it: `quote-images`
4. Make it **Public** (toggle the switch)
5. Click "Create bucket"

## Step 5: Set Storage Policies

1. Click on the `quote-images` bucket
2. Go to **Policies** tab
3. Click "New Policy"
4. Select "For full customization"
5. Create these policies:

**Policy 1: Allow uploads**
- Policy name: `Allow public uploads`
- SELECT operation: Checked
- INSERT operation: Checked
- Policy definition: `true`

**Policy 2: Allow public access**
- Policy name: `Allow public access`
- SELECT operation: Checked
- Policy definition: `true`

Or use SQL Editor to create policies:

```sql
-- Allow anyone to upload images
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'quote-images');

-- Allow anyone to view images
CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'quote-images');
```

## Step 6: Test Your Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Try adding a quote with an image
3. Check Supabase dashboard:
   - **Table Editor** → `quotes` table to see data
   - **Storage** → `quote-images` to see uploaded images

## Troubleshooting

- **Can't add quotes**: Check your `.env` file has correct URL and key
- **Images not uploading**: Verify storage bucket is public and policies are set
- **Data not showing**: Check RLS policies are enabled on the quotes table

## Security Note

For production, you should:
1. Add user authentication
2. Update RLS policies to only allow authenticated users
3. Validate file uploads (size, type)
4. Add rate limiting
