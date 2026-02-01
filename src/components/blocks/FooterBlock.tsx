import Footer from '@/components/layout/Footer';

interface FooterBlockProps {
  data: Record<string, never>;
}

const FooterBlock = ({ data }: FooterBlockProps) => {
  // Simply render the existing Footer component
  // No custom data needed as Footer uses useCafe() hook internally
  return <Footer />;
};

export default FooterBlock;
