import { Block, BlockType } from '@/hooks/useCafeWebsite';
import {
  HeroBlock,
  GalleryBlock,
  MenuPreviewBlock,
  CTABlock,
  FooterBlock,
} from '@/components/blocks';

interface LayoutEngineProps {
  blocks: Block[];
  layout: 'aroma' | 'luxury';
}

const getBlockComponent = (type: BlockType) => {
  const components = {
    hero: HeroBlock,
    gallery: GalleryBlock,
    menu_preview: MenuPreviewBlock,
    cta: CTABlock,
    footer: FooterBlock,
  };

  return components[type] || null;
};

const LayoutEngine = ({ blocks, layout }: LayoutEngineProps) => {
  // If blocks is not an array, log error and return null
  if (!Array.isArray(blocks)) {
    console.error('LayoutEngine: blocks must be an array', blocks);
    return null;
  }

  // If no blocks, return null (parent will handle fallback)
  if (blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const BlockComponent = getBlockComponent(block.type);

        if (!BlockComponent) {
          console.warn(`LayoutEngine: Unknown block type "${block.type}", skipping`);
          return null;
        }

        return (
          <div key={`${block.type}-${index}`}>
            <BlockComponent data={block.data} />
          </div>
        );
      })}
    </>
  );
};

export default LayoutEngine;
