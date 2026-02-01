import { Link } from 'react-router-dom';
import { useCafe } from '@/context/CafeContext';
import { useCafeWebsite } from '@/hooks/useCafeWebsite';
import Navbar from '@/components/layout/Navbar';
import FloatingCart from '@/components/cart/FloatingCart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AromaLayout, LuxuryLayout } from '@/layouts';

const TenantLanding = () => {
  const { cafe, loading: cafeLoading, error: cafeError } = useCafe();
  const { data: website, isLoading: websiteLoading, error: websiteError } = useCafeWebsite();

  // Loading state
  if (cafeLoading || websiteLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-12 bg-muted rounded w-64 mx-auto mb-4"></div>
                <div className="h-6 bg-muted rounded w-96 mx-auto mb-8"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <FloatingCart />
      </div>
    );
  }

  // Error state for cafe
  if (cafeError) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
              <p className="text-muted-foreground">{cafeError}</p>
            </Card>
          </div>
        </main>
        <FloatingCart />
      </div>
    );
  }

  // Error state for website
  if (websiteError) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
              <p className="text-muted-foreground mb-6">Failed to load page content</p>
              <Link to="/menu">
                <Button variant="hero">View Menu</Button>
              </Link>
            </Card>
          </div>
        </main>
        <FloatingCart />
      </div>
    );
  }

  // No website configured - show fallback
  if (!website || !website.blocks || website.blocks.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <h1 className="text-4xl font-bold mb-4">{cafe?.name}</h1>
              {cafe?.description && (
                <p className="text-lg text-muted-foreground mb-6">
                  {cafe.description}
                </p>
              )}
              <div className="bg-muted/30 rounded-lg p-6 mb-6">
                <p className="text-muted-foreground mb-4">
                  Landing page not configured yet
                </p>
              </div>
              <Link to="/menu">
                <Button variant="hero" size="lg">
                  View Menu
                </Button>
              </Link>
            </Card>
          </div>
        </main>
        <FloatingCart />
      </div>
    );
  }

  // Determine layout and render
  const layout = website.layout || 'aroma';
  const LayoutComponent = layout === 'luxury' ? LuxuryLayout : AromaLayout;

  // Log warning for unknown layouts
  if (layout !== 'aroma' && layout !== 'luxury') {
    console.warn(`Unknown layout: ${layout}, defaulting to aroma`);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <LayoutComponent blocks={website.blocks} />
      </main>
      <FloatingCart />
    </div>
  );
};

export default TenantLanding;
