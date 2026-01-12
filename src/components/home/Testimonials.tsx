import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya S.',
    rating: 5,
    text: 'The vibes here are unmatched! Perfect for studying or catching up with friends. The cappuccino is chef\'s kiss! ☕✨',
    avatar: '👩‍🎓',
  },
  {
    id: 2,
    name: 'Rahul M.',
    rating: 5,
    text: 'Best café in Kurukshetra, hands down. The green plants, cozy seating, and amazing pasta make it my favorite spot.',
    avatar: '👨‍💻',
  },
  {
    id: 3,
    name: 'Ananya K.',
    rating: 5,
    text: 'Peaceful ambiance, budget-friendly prices, and the brownie is to die for! This is my go-to place for weekend reads.',
    avatar: '📚',
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block bg-accent/20 text-coffee text-sm font-medium px-4 py-1 rounded-full mb-4">
            Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Real stories from our amazing community
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 shadow-card card-hover relative animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">Verified Guest</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Rating */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-card px-6 py-3 rounded-full shadow-soft">
            <img
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              alt="Google"
              className="w-6 h-6"
            />
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-bold text-foreground">4.7</span>
            </div>
            <span className="text-muted-foreground text-sm">based on 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
