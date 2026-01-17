-- RLS Policies with cafe_id scoping
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role, _cafe_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (_cafe_id IS NULL OR cafe_id = _cafe_id)
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_cafe_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cafe_id FROM public.user_roles WHERE user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.user_has_cafe_access(_cafe_id UUID, _required_role TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.cafe_id = _cafe_id
    AND (_required_role IS NULL OR ur.role::text = _required_role OR (_required_role = 'staff' AND ur.role = 'admin'))
  )
$$;

-- Cafes: Allow tenant resolution via domain lookup, admins manage their cafe
-- Note: For tenant resolution, frontend queries by domain before cafe_id is known
-- This policy allows domain-based lookup while maintaining security
CREATE POLICY "Public can view cafes by domain or role"
ON public.cafes FOR SELECT
USING (
  domain = COALESCE(current_setting('request.domain', true)::text, '')
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.cafe_id = cafes.id
  )
);

CREATE POLICY "Admins can manage own cafe"
ON public.cafes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = cafes.id
  )
);

-- Profiles: Users view own, admins view cafe members
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view cafe user profiles"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.cafe_id = ur2.cafe_id
    WHERE ur1.user_id = auth.uid()
    AND ur1.role = 'admin'
    AND ur2.user_id = profiles.id
  )
);

-- User roles: Users view own, admins manage cafe roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert cafe roles"
ON public.user_roles FOR INSERT
WITH CHECK (
  cafe_id IN (SELECT get_user_cafe_ids(auth.uid()))
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = user_roles.cafe_id
  )
);

CREATE POLICY "Admins can update cafe roles"
ON public.user_roles FOR UPDATE
USING (
  cafe_id IN (SELECT get_user_cafe_ids(auth.uid()))
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = user_roles.cafe_id
  )
);

CREATE POLICY "Admins can delete cafe roles"
ON public.user_roles FOR DELETE
USING (
  cafe_id IN (SELECT get_user_cafe_ids(auth.uid()))
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = user_roles.cafe_id
  )
);

-- Categories: Public view (scoped by cafe), admins manage cafe categories
CREATE POLICY "Public can view categories for cafe"
ON public.categories FOR SELECT
USING (
  cafe_id = current_setting('request.cafe_id', true)::uuid
);

CREATE POLICY "Admins can manage own cafe categories"
ON public.categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = categories.cafe_id
  )
);

-- Menu items: Public view (scoped by cafe), admins manage cafe menu
CREATE POLICY "Public can view menu items for cafe"
ON public.menu_items FOR SELECT
USING (
  cafe_id = current_setting('request.cafe_id', true)::uuid
);

CREATE POLICY "Admins can manage own cafe menu items"
ON public.menu_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = menu_items.cafe_id
  )
);

-- Tables: Public view (scoped by cafe), admins manage cafe tables
CREATE POLICY "Public can view tables for cafe"
ON public.tables FOR SELECT
USING (
  cafe_id = current_setting('request.cafe_id', true)::uuid
);

CREATE POLICY "Admins can manage own cafe tables"
ON public.tables FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = tables.cafe_id
  )
);

-- Orders: Customers insert/view (scoped by request.cafe_id), staff update, admin delete
CREATE POLICY "Customers can insert orders for cafe"
ON public.orders FOR INSERT
WITH CHECK (
  cafe_id = current_setting('request.cafe_id', true)::uuid
);

CREATE POLICY "Public can view orders for cafe"
ON public.orders FOR SELECT
USING (
  cafe_id = current_setting('request.cafe_id', true)::uuid
);

CREATE POLICY "Staff can view all cafe orders"
ON public.orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'staff')
    AND ur.cafe_id = orders.cafe_id
  )
);

CREATE POLICY "Staff can update cafe orders"
ON public.orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'staff')
    AND ur.cafe_id = orders.cafe_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'staff')
    AND ur.cafe_id = orders.cafe_id
  )
);

CREATE POLICY "Admins can delete cafe orders"
ON public.orders FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.cafe_id = orders.cafe_id
  )
);
