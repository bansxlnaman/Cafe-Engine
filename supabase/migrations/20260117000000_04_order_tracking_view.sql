-- View for public order tracking (hides sensitive data)
CREATE OR REPLACE VIEW public.order_tracking AS
SELECT 
  id,
  order_number,
  table_number,
  items,
  status,
  total_amount,
  created_at,
  updated_at,
  cafe_id,
  CASE 
    WHEN customer_phone IS NOT NULL THEN '***' 
    ELSE NULL 
  END as customer_phone_masked,
  special_instructions
FROM public.orders;

GRANT SELECT ON public.order_tracking TO anon, authenticated;
