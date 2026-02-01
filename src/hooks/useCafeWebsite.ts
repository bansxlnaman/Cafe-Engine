import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCafe } from '@/context/CafeContext';

export type BlockType = 'hero' | 'gallery' | 'menu_preview' | 'cta' | 'footer';

export interface Block {
  type: BlockType;
  data: Record<string, any>;
}

export interface CafeWebsite {
  id: string;
  cafe_id: string;
  layout: 'aroma' | 'luxury';
  blocks: Block[];
  created_at: string;
  updated_at: string;
}

const fetchCafeWebsite = async (cafeId: string): Promise<CafeWebsite | null> => {
  const { data, error } = await supabase
    .from('cafe_websites')
    .select('*')
    .eq('cafe_id', cafeId)
    .single();

  if (error) {
    // If no website is configured, return null instead of throwing
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};

export const useCafeWebsite = () => {
  const { cafe } = useCafe();

  return useQuery({
    queryKey: ['cafe-website', cafe?.id],
    queryFn: () => cafe?.id ? fetchCafeWebsite(cafe.id) : Promise.resolve(null),
    enabled: !!cafe?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes - websites change less frequently than menu items
  });
};
