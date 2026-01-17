-- Storage bucket setup for menu images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

CREATE OR REPLACE FUNCTION public.extract_cafe_id_from_path(_path TEXT)
RETURNS UUID
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  path_parts TEXT[];
BEGIN
  path_parts := string_to_array(_path, '/');
  IF array_length(path_parts, 1) >= 2 AND path_parts[1] = 'menu-images' THEN
    RETURN path_parts[2]::UUID;
  END IF;
  RETURN NULL;
END;
$$;

CREATE POLICY "Cafe admins can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = public.extract_cafe_id_from_path(name)
  )
);

CREATE POLICY "Cafe admins can update own folder files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = public.extract_cafe_id_from_path(name)
  )
)
WITH CHECK (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = public.extract_cafe_id_from_path(name)
  )
);

CREATE POLICY "Cafe admins can delete own folder files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = public.extract_cafe_id_from_path(name)
  )
);
