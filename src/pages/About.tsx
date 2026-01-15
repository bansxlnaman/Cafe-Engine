import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCart from '@/components/cart/FloatingCart';
import { Leaf, Heart, Users, Award, MapPin, Clock, Phone } from 'lucide-react';
import { useCafe } from '@/context/CafeContext';
import heroImage from '@/assets/hero-cafe.jpg';

const About = () => {
  const { cafe, loading } = useCafe();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={heroImage}
            alt={cafe?.name || 'Café'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 dark:bg-primary/80 flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
                About Us
              </h1>
              <p className="text-lg opacity-90">Our Story & Vision</p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Welcome to {cafe?.name || 'Our Café'}
              </h2>
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6 mx-auto" />
                </div>
              ) : (
                <>
                  {cafe?.description ? (
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {cafe.description}
                    </p>
                  ) : (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Our café is more than just a coffee shop. It's a sanctuary filled with warm lighting 
                      and the aroma of freshly brewed coffee. Every corner is designed for comfort, 
                      every dish crafted with love.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Leaf, title: 'Fresh & Natural', desc: 'Quality ingredients, no shortcuts' },
                { icon: Heart, title: 'Made with Love', desc: 'Every dish, every time' },
                { icon: Users, title: 'Community First', desc: 'A space for everyone' },
                { icon: Award, title: 'Quality Always', desc: 'Excellence in every detail' },
              ].map((item) => (
                <div key={item.title} className="text-center p-6">
                  <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Location */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-center mb-8">
                Come Visit Us
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Address & Contact */}
                <div className="space-y-4">
                  {cafe?.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="opacity-90">{cafe.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {cafe?.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <a href={`tel:${cafe.phone}`} className="opacity-90 hover:opacity-100">
                          {cafe.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {cafe?.opening_hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Opening Hours</h3>
                        <p className="opacity-90 whitespace-pre-line">{cafe.opening_hours}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Maps */}
                {cafe?.google_maps_url && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Find Us</h3>
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-primary-foreground/20">
                      <iframe
                        src={cafe.google_maps_url}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="dark:opacity-90"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default About;
