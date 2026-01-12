import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCart from '@/components/cart/FloatingCart';
import MenuCard from '@/components/menu/MenuCard';
import { categories, getItemsByCategory } from '@/lib/menuData';
import { cn } from '@/lib/utils';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const items = getItemsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24 pb-24">
        {/* Header */}
        <div className="bg-primary/5 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Our Menu
            </h1>
            <p className="text-muted-foreground">
              Fresh ingredients, crafted with love
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {categories.find(c => c.id === activeCategory)?.description}
            </p>
          </div>

          <div className="grid gap-3 max-w-2xl">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Menu;
