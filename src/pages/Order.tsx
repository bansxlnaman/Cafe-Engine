import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const tableNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const Order = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalAmount, 
    tableNumber, 
    setTableNumber, 
    specialInstructions, 
    setSpecialInstructions,
    clearCart 
  } = useCart();
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      toast.error('Please select your table number');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsPlacing(true);
    
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
    
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
                Order Confirmed! 🎉
              </h1>
              <p className="text-muted-foreground mb-2">
                Your order has been sent to the kitchen.
              </p>
              <p className="text-lg font-semibold text-primary mb-6">
                Table #{tableNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to home...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-20">
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
                No items to order
              </h1>
              <p className="text-muted-foreground mb-6">
                Add items from the menu first!
              </p>
              <Link to="/menu">
                <Button variant="hero">Browse Menu</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Place Order
              </h1>
            </div>

            {/* Table Selection */}
            <div className="bg-card rounded-xl p-6 shadow-card mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg text-foreground">Select Your Table</h2>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {tableNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setTableNumber(num)}
                    className={`
                      h-12 rounded-lg font-semibold transition-all
                      ${tableNumber === num 
                        ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-xl p-6 shadow-card mb-6">
              <h2 className="font-semibold text-lg text-foreground mb-4">Order Items</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-card rounded-xl p-6 shadow-card mb-6">
              <h2 className="font-semibold text-lg text-foreground mb-4">Special Instructions</h2>
              <Textarea
                placeholder="E.g., less spicy, no onions, extra cheese..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Payment Info */}
            <div className="bg-accent/20 rounded-xl p-6 mb-6 text-center">
              <p className="text-coffee font-medium">💳 Pay at Counter</p>
              <p className="text-sm text-muted-foreground mt-1">
                Payment will be collected when your order is ready
              </p>
            </div>

            {/* Place Order Button */}
            <Button
              variant="hero"
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacing}
            >
              {isPlacing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Placing Order...
                </>
              ) : (
                `Place Order • ₹${totalAmount}`
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Order;
