import { Provider, ServiceCategory, getAllServiceCategories, getCoverageType } from '@/lib/parseCSV';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  ExternalLink,
  Wrench,
  Briefcase,
  Leaf,
  Coins,
  Lightbulb,
  Rocket,
  TrendingUp,
  Globe2,
  Building2,
  Earth
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface ProviderDetailModalProps {
  provider: Provider;
}

const categoryConfig: Record<ServiceCategory, { label: string; icon: LucideIcon; colorClass: string }> = {
  technical: { label: 'Technical Services', icon: Wrench, colorClass: 'bg-tag-technical/15 text-tag-technical border-tag-technical/30' },
  business: { label: 'Business Services', icon: Briefcase, colorClass: 'bg-tag-business/15 text-tag-business border-tag-business/30' },
  social: { label: 'Social & Environmental', icon: Leaf, colorClass: 'bg-tag-social/15 text-tag-social border-tag-social/30' },
  funding: { label: 'Funding & Financing', icon: Coins, colorClass: 'bg-tag-funding/15 text-tag-funding border-tag-funding/30' },
};

const voucherConfig = {
  ideation: { label: 'Ideation', icon: Lightbulb, amount: '€25K', desc: 'Early-stage innovation support' },
  scaleup: { label: 'Scale-up', icon: Rocket, amount: '€50K', desc: 'Growth acceleration funding' },
  commercialisation: { label: 'Commercialisation', icon: TrendingUp, amount: '€25K', desc: 'Market entry support' },
};

const coverageConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  local: { icon: Building2, color: 'text-amber-500 bg-amber-500/10', label: 'Local Coverage' },
  eu: { icon: Globe2, color: 'text-blue-500 bg-blue-500/10', label: 'EU-wide Coverage' },
  global: { icon: Earth, color: 'text-emerald-500 bg-emerald-500/10', label: 'Global Coverage' },
};

export function ProviderDetailModal({ provider }: ProviderDetailModalProps) {
  const serviceCategories = getAllServiceCategories(provider);
  const hasServices = serviceCategories.length > 0;
  const hasVouchers = provider.voucherTypes.length > 0;
  
  const coverageType = getCoverageType(provider.coverage);
  const coverage = coverageConfig[coverageType] || coverageConfig.eu;
  const CoverageIcon = coverage.icon;

  return (
    <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col bg-gradient-card">
      <DialogHeader className="pb-3 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              {provider.name}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {provider.country && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {provider.country}
                </span>
              )}
              {provider.coverage && (
                <span className={cn(
                  'flex items-center gap-1.5 text-sm px-2 py-1 rounded-full',
                  coverage.color
                )}>
                  <CoverageIcon className="w-4 h-4" />
                  {provider.coverage}
                </span>
              )}
            </div>
          </div>
          
          {provider.website && (
            <Button asChild variant="default" size="sm" className="gap-2">
              <a 
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </DialogHeader>
      
      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {/* Description */}
        {provider.description && (
          <section>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              About
            </h4>
            <p className="text-foreground leading-relaxed text-sm">
              {provider.description}
            </p>
          </section>
        )}

        {/* Services and Vouchers side-by-side */}
        <div className="flex gap-6">
          {/* Services by Category - 2x2 grid */}
          {hasServices && (
            <section className="flex-1">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Services Offered
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {serviceCategories.map(cat => {
                  const config = categoryConfig[cat];
                  const services = provider.services[cat];
                  const IconComponent = config.icon;
                  return (
                    <div key={cat} className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className={cn('w-4 h-4', `text-tag-${cat}`)} />
                        <span className="font-semibold text-foreground text-sm">{config.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {services.map((service, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className={cn('text-xs py-0.5 px-2', config.colorClass)}
                          >
                            {service.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Voucher Types - vertical stack on right */}
          {hasVouchers && (
            <section className="w-56 shrink-0">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Voucher Types
              </h4>
              <div className="space-y-2">
                {provider.voucherTypes.map(type => {
                  const config = voucherConfig[type];
                  const IconComponent = config.icon;
                  return (
                    <div 
                      key={type}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-primary/5 border border-primary/20"
                    >
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">
                          {config.label}
                        </div>
                        <div className="text-xs text-primary font-medium">
                          {config.amount}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </DialogContent>
  );
}
