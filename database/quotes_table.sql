-- Create quotes table for storing Chinese quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  meaning TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (public access for development)
-- WARNING: For production, you should add authentication and restrict access
CREATE POLICY "Allow all operations on quotes" ON quotes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for quote images
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-images', 'quote-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for quote-images bucket
CREATE POLICY "Allow public uploads to quote-images" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'quote-images');

CREATE POLICY "Allow public access to quote-images" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'quote-images');

CREATE POLICY "Allow public updates to quote-images" ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'quote-images')
  WITH CHECK (bucket_id = 'quote-images');

CREATE POLICY "Allow public deletes from quote-images" ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'quote-images');
