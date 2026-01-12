import { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle, RefreshCw, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  table_number: string;
  items: OrderItem[];
  special_instructions: string | null;
  status: string;
  total_amount: number;
  customer_phone: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-red-500',
  preparing: 'bg-yellow-500',
  ready: 'bg-green-500',
  served: 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
  new: 'New Order',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
};

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('active');

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'active') {
      query = query.in('status', ['new', 'preparing', 'ready']);
    } else if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } else {
      setOrders((data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[]
      })));
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } else {
      toast.success(`Order marked as ${statusLabels[newStatus]}`);
      fetchOrders();
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ${diffMins % 60}m ago`;
  };

  useEffect(() => {
    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Play notification sound for new orders
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => {});
            toast.success(`New order from Table ${(payload.new as Order).table_number}!`, {
              icon: <Bell className="w-5 h-5" />,
            });
          }
          
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const getNextStatus = (currentStatus: string): string | null => {
    const flow: Record<string, string> = {
      new: 'preparing',
      preparing: 'ready',
      ready: 'served',
    };
    return flow[currentStatus] || null;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Kitchen Display</h1>
              <p className="text-sm opacity-80">Bistro@17</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {['active', 'new', 'preparing', 'ready', 'served', 'all'].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
            <Button 
              variant="secondary" 
              size="icon"
              onClick={fetchOrders}
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      {/* Orders Grid */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {loading && orders.length === 0 ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ChefHat className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold text-muted-foreground">No orders yet</h2>
              <p className="text-muted-foreground/70">New orders will appear here automatically</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                
                return (
                  <Card 
                    key={order.id} 
                    className={`overflow-hidden ${
                      order.status === 'new' ? 'ring-2 ring-red-500 animate-pulse' : ''
                    }`}
                  >
                    {/* Status Bar */}
                    <div className={`${statusColors[order.status]} text-white px-4 py-2 flex items-center justify-between`}>
                      <span className="font-bold text-lg">Table {order.table_number}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {statusLabels[order.status]}
                      </Badge>
                    </div>

                    {/* Order Content */}
                    <div className="p-4">
                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="w-4 h-4" />
                        {getTimeElapsed(order.created_at)}
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="font-medium">
                              {item.quantity}× {item.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Special Instructions */}
                      {order.special_instructions && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-yellow-800">
                            📝 {order.special_instructions}
                          </p>
                        </div>
                      )}

                      {/* Total */}
                      <div className="border-t pt-3 mb-4">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>₹{order.total_amount}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {nextStatus && (
                        <Button 
                          className="w-full gap-2"
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                        >
                          {nextStatus === 'preparing' && '👨‍🍳 Start Preparing'}
                          {nextStatus === 'ready' && '✅ Mark Ready'}
                          {nextStatus === 'served' && '🍽️ Mark Served'}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Kitchen;
