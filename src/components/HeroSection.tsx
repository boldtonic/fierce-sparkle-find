import { MousePointerClick } from 'lucide-react';
import fierceLogo from '@/assets/fierce-logo-white.png';
export function HeroSection() {
  return <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Fierce Logo */}
          <div className="flex justify-center mb-6">
            <img src={fierceLogo} alt="FIERCE Programme Logo" className="h-20 md:h-24 w-auto" />
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <MousePointerClick className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">External Service Provider Catalogue</span>
          </div>
          
          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            FIERCE
            <span className="block text-accent">Service Providers</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover qualified service providers ready to support your SME through 
            <span className="text-accent font-semibold"> Ideation</span>,
            <span className="text-accent font-semibold"> Scale-up</span>, and
            <span className="text-accent font-semibold"> Commercialisation</span> vouchers.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-accent">Up to €25K</div>
              <div className="text-sm text-primary-foreground/70">Ideation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-accent">Up to €50K</div>
              <div className="text-sm text-primary-foreground/70">Scale-up</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-accent">Up to €25K</div>
              <div className="text-sm text-primary-foreground/70">Commercialisation</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background" />
        </svg>
      </div>
    </section>;
}