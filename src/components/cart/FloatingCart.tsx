import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const FloatingCart = () => {
  const { totalItems, totalAmount } = useCart();

  if (totalItems === 0) return null;

  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-elevated flex items-center gap-3 hover:scale-105 transition-transform animate-scale-in"
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      </div>
      <span className="font-semibold">₹{totalAmount}</span>
    </Link>
  );
};

export default FloatingCart;
