import { useState } from 'react';
import { Provider } from '@/lib/parseCSV';
import { ServiceTag } from './ServiceTag';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Lightbulb,
  Rocket,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderCardProps {
  provider: Provider;
  index: number;
}

const voucherConfig = {
  ideation: { icon: Lightbulb, label: 'Ideation', className: 'voucher-ideation' },
  scaleup: { icon: Rocket, label: 'Scale-up', className: 'voucher-scaleup' },
  commercialisation: { icon: TrendingUp, label: 'Commercialisation', className: 'voucher-commercialisation' },
};

export function ProviderCard({ provider, index }: ProviderCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const voucherTypes = [
    { key: 'ideation' as const, services: provider.ideation },
    { key: 'scaleup' as const, services: provider.scaleup },
    { key: 'commercialisation' as const, services: provider.commercialisation },
  ].filter(v => v.services.length > 0);

  const hasServices = voucherTypes.length > 0;
  const shouldShowExpand = (provider.description?.length || 0) > 120 || hasServices;

  return (
    <Card 
      className={cn(
        'card-elevated overflow-hidden animate-in',
        'group'
      )}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-base text-foreground truncate group-hover:text-primary transition-colors">
              {provider.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-muted-foreground">
              {provider.country && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {provider.country}
                </span>
              )}
              {provider.coverage && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {provider.coverage}
                </span>
              )}
            </div>
          </div>
          
          {provider.website && (
            <a 
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label={`Visit ${provider.name} website`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        
        {/* Voucher badges */}
        {voucherTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {voucherTypes.map(({ key }) => {
              const config = voucherConfig[key];
              const Icon = config.icon;
              return (
                <span key={key} className={cn('voucher-badge', config.className)}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              );
            })}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Description */}
        {provider.description && (
          <p className={cn(
            'text-sm text-muted-foreground leading-relaxed',
            !expanded && 'line-clamp-2'
          )}>
            {provider.description}
          </p>
        )}
        
        {/* Expanded services */}
        {expanded && hasServices && (
          <div className="mt-4 space-y-3 pt-4 border-t border-border">
            {voucherTypes.map(({ key, services }) => {
              const config = voucherConfig[key];
              const Icon = config.icon;
              return (
                <div key={key}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {services.map((service, i) => (
                      <ServiceTag key={i} service={service} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Expand button */}
        {shouldShowExpand && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-3 h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 mr-1" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 mr-1" />
                More details
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
