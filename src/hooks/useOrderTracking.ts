import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  total_amount: number;
  table_number: string;
  special_instructions: string | null;
  created_at: string;
}

export const useOrderTracking = (orderId: string | null) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError) {
        setError('Order not found. Please check your order ID.');
        setOrder(null);
      } else {
        // Parse JSONB items
        const parsedItems = Array.isArray(data.items) 
          ? (data.items as unknown as OrderItem[])
          : [];
        setOrder({
          ...data,
          items: parsedItems,
        });
      }
      setLoading(false);
    };

    fetchOrder();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          const parsedItems = Array.isArray(newData.items) 
            ? (newData.items as unknown as OrderItem[])
            : [];
          setOrder({
            ...newData,
            items: parsedItems,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { order, loading, error };
};
