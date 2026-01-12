import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCart from '@/components/cart/FloatingCart';
import { Leaf, Heart, Users, Award } from 'lucide-react';
import heroImage from '@/assets/hero-cafe.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={heroImage}
            alt="Bistro@17"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
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
                Welcome to Your Cozy Corner
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Nestled in the heart of Sector 17, Kurukshetra, Bistro@17 was born from a simple dream — 
                to create a space where good coffee meets great company. A place where you can escape 
                the everyday hustle, dive into a good book, or simply watch the world go by.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our café is more than just a coffee shop. It's a sanctuary filled with lush green plants, 
                warm lighting, and the aroma of freshly brewed coffee. Every corner is designed for comfort, 
                every dish crafted with love.
              </p>
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
                { icon: Award, title: 'Quality Always', desc: '500+ happy reviews' },
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

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Come Visit Us
            </h2>
            <p className="text-lg opacity-90 mb-2">
              Sector 17, Kurukshetra, Haryana
            </p>
            <p className="opacity-80">
              Open Daily: 10 AM - 10 PM
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default About;
