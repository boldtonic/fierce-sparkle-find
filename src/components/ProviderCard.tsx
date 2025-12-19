import { useState } from 'react';
import { Provider, ServiceCategory, getAllServiceCategories, getCoverageType } from '@/lib/parseCSV';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
  Earth,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ProviderDetailModal } from './ProviderDetailModal';

interface ProviderCardProps {
  provider: Provider;
  index: number;
}

const categoryConfig: Record<ServiceCategory, { label: string; icon: LucideIcon; colorClass: string }> = {
  technical: { label: 'Technical', icon: Wrench, colorClass: 'bg-tag-technical/15 text-tag-technical border-tag-technical/30' },
  business: { label: 'Business', icon: Briefcase, colorClass: 'bg-tag-business/15 text-tag-business border-tag-business/30' },
  social: { label: 'Social/Environmental', icon: Leaf, colorClass: 'bg-tag-social/15 text-tag-social border-tag-social/30' },
  funding: { label: 'Funding', icon: Coins, colorClass: 'bg-tag-funding/15 text-tag-funding border-tag-funding/30' },
};

const voucherConfig = {
  ideation: { label: 'Ideation', icon: Lightbulb, amount: '€25K' },
  scaleup: { label: 'Scale-up', icon: Rocket, amount: '€50K' },
  commercialisation: { label: 'Commercialisation', icon: TrendingUp, amount: '€25K' },
};

const coverageIcons: Record<string, { icon: LucideIcon; color: string }> = {
  local: { icon: Building2, color: 'text-amber-500' },
  eu: { icon: Globe2, color: 'text-blue-500' },
  global: { icon: Earth, color: 'text-emerald-500' },
};

export function ProviderCard({ provider, index }: ProviderCardProps) {
  const [open, setOpen] = useState(false);
  
  const serviceCategories = getAllServiceCategories(provider);
  const hasServices = serviceCategories.length > 0;
  const hasVouchers = provider.voucherTypes.length > 0;
  
  const coverageType = getCoverageType(provider.coverage);
  const CoverageIcon = coverageIcons[coverageType]?.icon || Globe2;
  const coverageColor = coverageIcons[coverageType]?.color || 'text-muted-foreground';

  const delayClass = `animate-fade-in [animation-delay:${index * 50}ms] [animation-fill-mode:backwards]`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card 
        className={cn(
          'group relative overflow-hidden bg-gradient-card border-border/50',
          'shadow-card hover:shadow-card-hover',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-1',
          delayClass
        )}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {provider.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                {provider.country && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {provider.country}
                  </span>
                )}
                {provider.coverage && (
                  <span className={cn('flex items-center gap-1.5', coverageColor)}>
                    <CoverageIcon className="w-3.5 h-3.5" />
                    <span className="text-muted-foreground">{provider.coverage}</span>
                  </span>
                )}
              </div>
            </div>
            
            {provider.website && (
              <a 
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          {/* Service Category Badges */}
          {hasServices && (
            <div className="flex flex-wrap gap-2 mt-3">
              {serviceCategories.map(cat => {
                const config = categoryConfig[cat];
                const count = provider.services[cat].length;
                return (
                  <Badge 
                    key={cat}
                    variant="outline"
                    className={cn('flex items-center gap-1.5 px-2.5 py-1 font-medium', config.colorClass)}
                  >
                    <config.icon className="w-3.5 h-3.5" />
                    {config.label}
                    <span className="text-xs opacity-70">({count})</span>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Voucher Types */}
          {hasVouchers && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {provider.voucherTypes.map(type => {
                const config = voucherConfig[type];
                return (
                  <Badge 
                    key={type}
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 opacity-80"
                  >
                    <config.icon className="w-3 h-3 mr-1" />
                    {config.label} {config.amount}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Description - truncated */}
          {provider.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {provider.description}
            </p>
          )}
          
          {/* View details button */}
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-muted-foreground hover:text-foreground hover:bg-primary/10"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View details
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>
      
      <ProviderDetailModal provider={provider} />
    </Dialog>
  );
}
