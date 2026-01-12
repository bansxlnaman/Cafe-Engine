import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedMenu from '@/components/home/FeaturedMenu';
import VibesSection from '@/components/home/VibesSection';
import Testimonials from '@/components/home/Testimonials';
import FloatingCart from '@/components/cart/FloatingCart';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <VibesSection />
        <FeaturedMenu />
        <Testimonials />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Index;
