-- Core schema: cafes, enums, base functions
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

CREATE TABLE public.cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  tagline TEXT,
  theme JSONB DEFAULT '{"default_mode": "light", "primary_color": "#4f7c5a", "accent_color": "#e0b15a"}'::jsonb,
  address TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  opening_hours TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, cafe_id, role)
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🍽️',
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  category TEXT NOT NULL,
  image_url TEXT,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE NOT NULL,
  table_number TEXT NOT NULL,
  qr_code_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (cafe_id, table_number)
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafes(id) ON DELETE CASCADE NOT NULL,
  table_number TEXT NOT NULL,
  items JSONB NOT NULL,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'served', 'cancelled')),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount > 0),
  customer_phone TEXT,
  order_number INT,
  order_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_cafes_updated_at
BEFORE UPDATE ON public.cafes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INT;
BEGIN
  SELECT COALESCE(MAX(order_number), 0) + 1 INTO next_number
  FROM public.orders
  WHERE cafe_id = NEW.cafe_id
  AND order_date = CURRENT_DATE;
  
  NEW.order_number := next_number;
  NEW.order_date := CURRENT_DATE;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.validate_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.total_amount <= 0 THEN
    RAISE EXCEPTION 'Total amount must be greater than 0';
  END IF;

  IF NEW.items IS NULL OR jsonb_array_length(NEW.items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  IF NEW.status NOT IN ('new', 'preparing', 'ready', 'served', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid order status';
  END IF;

  IF NEW.table_number IS NULL OR trim(NEW.table_number) = '' THEN
    RAISE EXCEPTION 'Table number is required';
  END IF;

  IF NEW.cafe_id IS NULL THEN
    RAISE EXCEPTION 'Cafe ID is required';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.cafes WHERE id = NEW.cafe_id) THEN
    RAISE EXCEPTION 'Invalid cafe ID';
  END IF;

  IF jsonb_typeof(NEW.items) != 'array' THEN
    RAISE EXCEPTION 'Items must be an array';
  END IF;

  DECLARE
    item jsonb;
  BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
      IF NOT (item ? 'id' AND item ? 'name' AND item ? 'quantity' AND item ? 'price') THEN
        RAISE EXCEPTION 'Each item must have id, name, quantity, and price';
      END IF;

      IF (item->>'quantity')::numeric <= 0 THEN
        RAISE EXCEPTION 'Item quantity must be greater than 0';
      END IF;

      IF (item->>'price')::numeric < 0 THEN
        RAISE EXCEPTION 'Item price cannot be negative';
      END IF;
    END LOOP;
  END;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_order_trigger
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.validate_order();

CREATE INDEX idx_menu_items_cafe_id ON public.menu_items(cafe_id);
CREATE INDEX idx_categories_cafe_id ON public.categories(cafe_id);
CREATE INDEX idx_orders_cafe_id ON public.orders(cafe_id);
CREATE INDEX idx_orders_cafe_id_status ON public.orders(cafe_id, status);
CREATE INDEX idx_orders_cafe_id_created_at ON public.orders(cafe_id, created_at DESC);
CREATE INDEX idx_orders_order_date ON public.orders(order_date);
CREATE INDEX idx_tables_cafe_id ON public.tables(cafe_id);
CREATE INDEX idx_user_roles_cafe_id ON public.user_roles(cafe_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_cafes_domain ON public.cafes(domain);

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
