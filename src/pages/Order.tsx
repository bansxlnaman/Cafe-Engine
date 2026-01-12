import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MapPin, MessageCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateCustomerConfirmationLink, type OrderDetails } from '@/lib/whatsapp';

const tableNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

const Order = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [orderId, setOrderId] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [whatsappLink, setWhatsappLink] = useState<string>('');

  // Auto-fill table number from QR code scan
  useEffect(() => {
    const tableFromQR = searchParams.get('table');
    if (tableFromQR && tableNumbers.includes(tableFromQR)) {
      setTableNumber(tableFromQR);
      toast.success(`Table ${tableFromQR} selected from QR code!`);
    }
  }, [searchParams, setTableNumber]);

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

    try {
      // Insert order into database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          table_number: tableNumber,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          special_instructions: specialInstructions || null,
          total_amount: totalAmount,
          customer_phone: customerPhone || null,
          status: 'new',
        })
        .select()
        .single();

      if (error) throw error;

      setOrderId(data.id);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');

      // Generate WhatsApp link if phone provided
      if (customerPhone) {
        const orderDetails: OrderDetails = {
          orderId: data.id,
          tableNumber,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount,
          specialInstructions: specialInstructions || undefined,
        };
        setWhatsappLink(generateCustomerConfirmationLink(customerPhone, orderDetails));
      }

      setTimeout(() => {
        clearCart();
      }, 5000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
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
              <p className="text-lg font-semibold text-primary mb-4">
                Table #{tableNumber}
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Order ID: {orderId.slice(0, 8)}
              </p>
              
              {whatsappLink && (
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors mb-6"
                >
                  <MessageCircle className="w-5 h-5" />
                  Get Confirmation on WhatsApp
                </a>
              )}
              
              <div className="flex flex-col gap-3 mt-6">
                <Link to="/menu">
                  <Button variant="outline" className="w-full">
                    Order More Items
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
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

            {/* WhatsApp Notification */}
            <div className="bg-card rounded-xl p-6 shadow-card mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-lg text-foreground">WhatsApp Updates (Optional)</h2>
              </div>
              <Input
                type="tel"
                placeholder="Your phone number (e.g., 9876543210)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Get order confirmation and ready notification on WhatsApp
              </p>
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
