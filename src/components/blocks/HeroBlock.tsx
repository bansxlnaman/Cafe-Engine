import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCafe } from '@/context/CafeContext';

interface HeroBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

const HeroBlock = ({ data }: HeroBlockProps) => {
  const { cafe } = useCafe();

  const heading = data.heading || cafe?.tagline || 'Welcome to Our Cafe';
  const subheading = data.subheading || cafe?.description || 'Experience the best coffee in town';
  const backgroundImage = data.backgroundImage;
  const ctaText = data.ctaText;
  const ctaLink = data.ctaLink;

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Image or Gradient */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage}
              alt={heading}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl space-y-6 animate-fade-up">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
            {heading}
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            {subheading}
          </p>

          {/* CTA Button */}
          {ctaText && ctaLink && (
            <div className="pt-4">
              {ctaLink.startsWith('http') ? (
                <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" size="lg">
                    {ctaText}
                  </Button>
                </a>
              ) : (
                <Link to={ctaLink}>
                  <Button variant="hero" size="lg">
                    {ctaText}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroBlock;
