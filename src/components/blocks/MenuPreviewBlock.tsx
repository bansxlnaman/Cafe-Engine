import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenuItems, getPopularItems } from '@/hooks/useMenuItems';
import { useCart } from '@/context/CartContext';

interface MenuPreviewBlockProps {
  data: {
    heading?: string;
    description?: string;
    showCount?: number;
    filterPopular?: boolean;
  };
}

const MenuPreviewBlock = ({ data }: MenuPreviewBlockProps) => {
  const { heading = 'Our Popular Dishes', description, showCount = 6, filterPopular = true } = data;
  const { data: menuItems = [], isLoading, error } = useMenuItems();
  const { addItem } = useCart();

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12">
        {heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              {heading}
            </h2>
            {description && (
              <p className="text-muted-foreground max-w-md mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-8 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state - hide block
  if (error) {
    console.error('MenuPreviewBlock: Error loading menu items', error);
    return null;
  }

  // Get items based on filter
  const itemsToShow = filterPopular
    ? getPopularItems(menuItems).slice(0, showCount)
    : menuItems.slice(0, showCount);

  // If no items, don't render the block
  if (itemsToShow.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      {/* Section Header */}
      {heading && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            {heading}
          </h2>
          {description && (
            <p className="text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {itemsToShow.map((item) => (
          <div
            key={item.id}
            className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover"
          >
            {/* Image */}
            {item.image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                </div>
                {item.isPopular && (
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ₹{item.price}
                </span>
                <Button
                  variant="accent"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  onClick={() => addItem(item)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Full Menu Button */}
      <div className="text-center">
        <Link to="/menu">
          <Button variant="outline" size="lg" className="group">
            View Full Menu
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default MenuPreviewBlock;
