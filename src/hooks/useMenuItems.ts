import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  isVeg: boolean;
  category: string;
  image?: string;
  isPopular: boolean;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Static categories with icons
export const categories: Category[] = [
  { id: 'Starters', name: 'Starters', icon: '🍟', description: 'Crispy beginnings' },
  { id: 'Burgers', name: 'Burgers', icon: '🍔', description: 'Juicy goodness' },
  { id: 'Pizza & Pasta', name: 'Pizza & Pasta', icon: '🍕', description: 'Italian favorites' },
  { id: 'Chinese', name: 'Chinese', icon: '🍜', description: 'Wok-fresh flavors' },
  { id: 'Beverages', name: 'Beverages', icon: '☕', description: 'Sip & chill' },
  { id: 'Desserts', name: 'Desserts', icon: '🍰', description: 'Sweet endings' },
];

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category', { ascending: true });

  if (error) {
    throw error;
  }

  // Transform database format to component format
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    description: item.description,
    isVeg: item.is_veg,
    category: item.category,
    image: item.image_url || undefined,
    isPopular: item.is_popular,
    isAvailable: item.is_available,
  }));
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: fetchMenuItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const getItemsByCategory = (items: MenuItem[], categoryId: string) =>
  items.filter(item => item.category === categoryId);

export const getPopularItems = (items: MenuItem[]) =>
  items.filter(item => item.isPopular);
