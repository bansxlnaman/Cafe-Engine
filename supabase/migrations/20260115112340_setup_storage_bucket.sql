-- Create storage bucket for menu images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to menu images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');

-- Allow authenticated users to upload menu images
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
);