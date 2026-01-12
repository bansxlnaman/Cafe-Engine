-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number TEXT NOT NULL,
  items JSONB NOT NULL,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'served', 'cancelled')),
  total_amount NUMERIC(10,2) NOT NULL,
  customer_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (customers placing orders)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view orders (for kitchen display)
CREATE POLICY "Anyone can view orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Allow anyone to update orders (for kitchen to update status)
CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create tables table for QR code management
CREATE TABLE public.tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number TEXT NOT NULL UNIQUE,
  qr_code_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view tables
CREATE POLICY "Anyone can view tables" 
ON public.tables 
FOR SELECT 
USING (true);

-- Allow anyone to insert tables (for admin setup)
CREATE POLICY "Anyone can create tables" 
ON public.tables 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update tables
CREATE POLICY "Anyone can update tables" 
ON public.tables 
FOR UPDATE 
USING (true);

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Insert default tables (1-20)
INSERT INTO public.tables (table_number) VALUES
  ('1'), ('2'), ('3'), ('4'), ('5'),
  ('6'), ('7'), ('8'), ('9'), ('10'),
  ('11'), ('12'), ('13'), ('14'), ('15'),
  ('16'), ('17'), ('18'), ('19'), ('20');