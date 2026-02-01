import { Block } from '@/hooks/useCafeWebsite';
import LayoutEngine from '@/components/LayoutEngine';

interface AromaLayoutProps {
  blocks: Block[];
}

const AromaLayout = ({ blocks }: AromaLayoutProps) => {
  return (
    <div className="aroma-layout">
      {blocks.map((block, index) => {
        // Determine background for alternating effect
        const isEven = index % 2 === 0;
        const bgClass = isEven ? 'bg-background' : 'bg-muted/30';

        return (
          <section key={`aroma-${block.type}-${index}`} className={`py-20 ${bgClass}`}>
            <div className="container max-w-7xl mx-auto px-4">
              <LayoutEngine blocks={[block]} layout="aroma" />
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AromaLayout;
