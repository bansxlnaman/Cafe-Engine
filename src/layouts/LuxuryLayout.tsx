import { Block } from '@/hooks/useCafeWebsite';
import LayoutEngine from '@/components/LayoutEngine';

interface LuxuryLayoutProps {
  blocks: Block[];
}

const LuxuryLayout = ({ blocks }: LuxuryLayoutProps) => {
  return (
    <div className="luxury-layout">
      {blocks.map((block, index) => {
        // Add border between sections for luxury look
        const borderClass = index < blocks.length - 1 ? 'border-b border-border' : '';

        return (
          <section key={`luxury-${block.type}-${index}`} className={`py-12 ${borderClass}`}>
            <div className="container max-w-6xl mx-auto px-4">
              <LayoutEngine blocks={[block]} layout="luxury" />
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default LuxuryLayout;
