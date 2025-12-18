import { Zap, Lightbulb, Rocket, TrendingUp } from 'lucide-react';

export function HeroSection() {
  const vouchers = [
    { icon: Lightbulb, label: 'Ideation', amount: '€25K', color: 'text-ideation bg-ideation/10' },
    { icon: Rocket, label: 'Scale-up', amount: '€50K', color: 'text-scaleup bg-scaleup/10' },
    { icon: TrendingUp, label: 'Commercialisation', amount: '€25K', color: 'text-commercialisation bg-commercialisation/10' },
  ];

  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      <div className="relative container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-white/90">External Service Provider Catalogue</span>
          </div>
          
          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1]">
            FIERCE Service<br />
            <span className="text-accent">Providers</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-white/70 max-w-xl mb-10 leading-relaxed">
            Discover qualified providers to support your SME through innovation vouchers. 
            Find the right partner for your growth journey.
          </p>
          
          {/* Voucher cards */}
          <div className="flex flex-wrap gap-3">
            {vouchers.map((voucher) => (
              <div 
                key={voucher.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <div className={`p-2 rounded-lg ${voucher.color}`}>
                  <voucher.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm text-white/60">{voucher.label}</div>
                  <div className="font-display font-bold text-white">{voucher.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
