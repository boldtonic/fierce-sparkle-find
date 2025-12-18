import { useState } from 'react';
import { Provider } from '@/lib/parseCSV';
import { ServiceTag } from './ServiceTag';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export function ProviderCard({ provider, index }: ProviderCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const hasServices = provider.ideation.length > 0 || 
                      provider.scaleup.length > 0 || 
                      provider.commercialisation.length > 0;

  const voucherTypes = [
    { key: 'ideation', label: 'Ideation', icon: Lightbulb, services: provider.ideation, amount: '€25K' },
    { key: 'scaleup', label: 'Scale-up', icon: Rocket, services: provider.scaleup, amount: '€50K' },
    { key: 'commercialisation', label: 'Commercialisation', icon: TrendingUp, services: provider.commercialisation, amount: '€25K' },
  ].filter(v => v.services.length > 0);

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden bg-gradient-card border-border/50',
        'shadow-card hover:shadow-card-hover',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1'
      )}
      style={{ 
        animationDelay: `${index * 50}ms`,
        opacity: 0,
        animation: 'fade-in-up 0.5s ease-out forwards'
      }}
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
                <span className="flex items-center gap-1.5">
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
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        
        {/* Voucher badges */}
        {voucherTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {voucherTypes.map(v => (
              <Badge 
                key={v.key}
                variant="secondary" 
                className="flex items-center gap-1.5 px-2.5 py-1 font-medium"
              >
                <v.icon className="w-3.5 h-3.5" />
                {v.label}
                <span className="text-muted-foreground font-normal">({v.amount})</span>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Description */}
        {provider.description && (
          <p className={cn(
            'text-sm text-muted-foreground leading-relaxed',
            !expanded && 'line-clamp-3'
          )}>
            {provider.description}
          </p>
        )}
        
        {/* Expanded services */}
        {expanded && hasServices && (
          <div className="mt-4 space-y-4 pt-4 border-t border-border/50">
            {voucherTypes.map(voucher => (
              <div key={voucher.key}>
                <div className="flex items-center gap-2 mb-2">
                  <voucher.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{voucher.label} Services</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {voucher.services.map((service, i) => (
                    <ServiceTag key={i} service={service} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Expand button */}
        {(provider.description?.length > 150 || hasServices) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-3 text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show details
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
