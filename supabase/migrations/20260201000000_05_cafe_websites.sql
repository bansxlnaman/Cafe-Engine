-- Create cafe_websites table for dynamic website configuration
CREATE TABLE public.cafe_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE NOT NULL UNIQUE,
  layout TEXT NOT NULL DEFAULT 'aroma' CHECK (layout IN ('aroma', 'luxury')),
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for efficient cafe_id lookups
CREATE INDEX idx_cafe_websites_cafe_id ON public.cafe_websites(cafe_id);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_cafe_websites_updated_at
BEFORE UPDATE ON public.cafe_websites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.cafe_websites ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all users to view websites (public websites)
CREATE POLICY "Allow public read access to cafe websites"
  ON public.cafe_websites
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can insert websites
CREATE POLICY "Allow admin insert access to cafe websites"
  ON public.cafe_websites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.cafe_id = cafe_websites.cafe_id
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can update websites
CREATE POLICY "Allow admin update access to cafe websites"
  ON public.cafe_websites
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.cafe_id = cafe_websites.cafe_id
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can delete websites
CREATE POLICY "Allow admin delete access to cafe websites"
  ON public.cafe_websites
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.cafe_id = cafe_websites.cafe_id
      AND user_roles.role = 'admin'
    )
  );
