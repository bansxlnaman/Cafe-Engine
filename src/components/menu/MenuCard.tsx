import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/hooks/useMenuItems';
import { useCart } from '@/context/CartContext';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="bg-card rounded-xl p-4 shadow-soft card-hover flex justify-between items-center gap-4">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
          {item.isPopular && (
            <span className="bg-accent/20 text-coffee text-xs font-medium px-2 py-0.5 rounded">
              Popular
            </span>
          )}
        </div>
        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
        )}
        <p className="font-bold text-primary mt-1">₹{item.price}</p>
      </div>

      {/* Add Button */}
      <div className="flex-shrink-0">
        {quantity === 0 ? (
          <Button
            variant="accent"
            size="sm"
            onClick={() => addItem(item)}
            className="rounded-full px-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        ) : (
          <div className="flex items-center gap-2 bg-accent/20 rounded-full p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(item.id, quantity - 1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-6 text-center font-semibold text-foreground">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => addItem(item)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
