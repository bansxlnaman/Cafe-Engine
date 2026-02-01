import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CTABlockProps {
  data: {
    heading: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    backgroundStyle?: 'solid' | 'gradient';
  };
}

const CTABlock = ({ data }: CTABlockProps) => {
  const {
    heading,
    description,
    buttonText,
    buttonLink,
    backgroundStyle = 'solid',
  } = data;

  // Background class based on style
  const backgroundClass =
    backgroundStyle === 'gradient'
      ? 'bg-gradient-to-br from-primary/20 via-background to-accent/20'
      : 'bg-muted/30';

  const isExternalLink = buttonLink.startsWith('http');

  return (
    <section className={`py-16 ${backgroundClass}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            {heading}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-4">
            {isExternalLink ? (
              <a href={buttonLink} target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="lg">
                  {buttonText}
                </Button>
              </a>
            ) : (
              <Link to={buttonLink}>
                <Button variant="hero" size="lg">
                  {buttonText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABlock;
