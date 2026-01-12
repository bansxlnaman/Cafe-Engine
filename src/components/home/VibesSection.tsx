import { Wifi, Zap, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Wifi,
    title: 'Free WiFi',
    description: 'High-speed internet for work or play',
  },
  {
    icon: Zap,
    title: 'Quick Service',
    description: 'Fresh orders served promptly',
  },
  {
    icon: Clock,
    title: 'Open Daily',
    description: '10 AM - 10 PM, all week',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish crafted carefully',
  },
];

const VibesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VibesSection;
