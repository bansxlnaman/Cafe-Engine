import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, ChefHat, UtensilsCrossed, Coffee } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { cn } from '@/lib/utils';

const statusSteps = [
  { status: 'new', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
  { status: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Our chefs are cooking your food' },
  { status: 'ready', label: 'Ready', icon: CheckCircle2, description: 'Your order is ready for pickup' },
  { status: 'served', label: 'Served', icon: UtensilsCrossed, description: 'Enjoy your meal!' },
];

const getStatusIndex = (status: string) => {
  const index = statusSteps.findIndex(s => s.status === status);
  return index >= 0 ? index : 0;
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('id') || '';
  const [orderId, setOrderId] = useState(initialOrderId);
  const [searchInput, setSearchInput] = useState(initialOrderId);
  
  const { order, loading, error } = useOrderTracking(orderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId(searchInput.trim());
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Track Your Order
            </h1>
            <p className="text-muted-foreground">
              Enter your order ID to see real-time status updates
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter Order ID"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!searchInput.trim()}>
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </div>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Coffee className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
              <p className="text-muted-foreground">Finding your order...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-destructive font-medium mb-2">Order Not Found</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </Card>
          )}

          {/* Order Details */}
          {order && !loading && (
            <div className="space-y-6 animate-fade-up">
              {/* Order Info Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Table</p>
                    <p className="font-bold text-lg">{order.table_number}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    Ordered at {new Date(order.created_at).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </Card>

              {/* Status Timeline */}
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Order Status</h2>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    
                    return (
                      <div key={step.status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                              isCompleted
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                              isCurrent && "ring-4 ring-primary/20"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={cn(
                                "w-0.5 h-8 mt-2",
                                index < currentStatusIndex ? "bg-primary" : "bg-muted"
                              )}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className={cn(
                            "font-medium",
                            isCompleted ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {step.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                      </div>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{order.total_amount}</span>
                    </div>
                  </div>
                </div>
                
                {order.special_instructions && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Special Instructions</p>
                    <p className="text-sm mt-1">{order.special_instructions}</p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!orderId && !loading && (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No Order Selected</p>
              <p className="text-muted-foreground">
                Enter your order ID above to track your order status in real-time.
              </p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
