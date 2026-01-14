import { useState, useEffect } from 'react';
import { Search, Filter, Clock, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  total_amount: number;
  table_number: string;
  special_instructions: string | null;
  created_at: string;
  customer_phone: string | null;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  preparing: 'bg-yellow-500',
  ready: 'bg-green-500',
  served: 'bg-muted',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');

  const fetchOrders = async () => {
    setLoading(true);
    
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply date filter
    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte('created_at', today.toISOString());
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('created_at', monthAgo.toISOString());
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } else {
      const parsedOrders = (data || []).map(order => ({
        ...order,
        items: Array.isArray(order.items) ? (order.items as unknown as OrderItem[]) : [],
      }));
      setOrders(parsedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Order marked as ${statusLabels[newStatus]}`);
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(search) ||
      order.table_number.toLowerCase().includes(search) ||
      (order.customer_phone && order.customer_phone.includes(search))
    );
  });

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diff = Math.floor((now.getTime() - orderTime.getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-serif font-bold">Orders Management</h2>
        <Button variant="outline" onClick={fetchOrders} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, table, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="served">Served</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`${statusColors[order.status]} text-white`}>
                      {statusLabels[order.status]}
                    </Badge>
                    <span className="font-mono text-sm text-muted-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Table {order.table_number}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getTimeElapsed(order.created_at)}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="text-sm">
                    {order.items.map((item, index) => (
                      <span key={index}>
                        {item.quantity}× {item.name}
                        {index < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>

                  {order.special_instructions && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Note: {order.special_instructions}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">₹{order.total_amount}</span>
                  
                  {order.status !== 'served' && (
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="served">Served</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <div>
            <span className="text-muted-foreground">Total Orders:</span>
            <span className="font-bold ml-2">{filteredOrders.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Revenue:</span>
            <span className="font-bold ml-2">
              ₹{filteredOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Active:</span>
            <span className="font-bold ml-2">
              {filteredOrders.filter(o => o.status !== 'served').length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrdersManagement;
