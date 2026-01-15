import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCafe } from '@/context/CafeContext';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  isVeg: boolean;
  category_id: string;
  category_name: string;
  image?: string;
  isPopular: boolean;
  isAvailable: boolean;
}

const fetchMenuItems = async (cafeId: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('cafe_id', cafeId)
    .eq('is_available', true)
    .order('categories(name)', { ascending: true });

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
    category_id: item.category_id,
    category_name: item.categories?.name || 'Uncategorized',
    image: item.image_url || undefined,
    isPopular: item.is_popular,
    isAvailable: item.is_available,
  }));
};

export const useMenuItems = () => {
  const { cafe } = useCafe();

  return useQuery({
    queryKey: ['menu-items', cafe?.id],
    queryFn: () => cafe?.id ? fetchMenuItems(cafe.id) : Promise.resolve([]),
    enabled: !!cafe?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const getItemsByCategory = (items: MenuItem[], categoryId: string) =>
  items.filter(item => item.category_id === categoryId);

export const getPopularItems = (items: MenuItem[]) =>
  items.filter(item => item.isPopular);
