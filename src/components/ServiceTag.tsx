import { ServiceCategory, ServiceItem } from '@/lib/parseCSV';
import { cn } from '@/lib/utils';

interface ServiceTagProps {
  service: ServiceItem | string;
  category?: ServiceCategory;
  className?: string;
}

export function ServiceTag({ service, category, className }: ServiceTagProps) {
  // Handle both ServiceItem objects and plain strings
  const serviceCategory = typeof service === 'object' ? service.category : (category || 'business');
  const displayName = typeof service === 'object' ? service.name : service;
  
  const categoryStyles: Record<ServiceCategory, string> = {
    technical: 'bg-tag-technical/10 text-tag-technical border-tag-technical/20',
    business: 'bg-tag-business/10 text-tag-business border-tag-business/20',
    social: 'bg-tag-social/10 text-tag-social border-tag-social/20',
    funding: 'bg-tag-funding/10 text-tag-funding border-tag-funding/20',
  };
  
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        'transition-all duration-200 hover:scale-105',
        categoryStyles[serviceCategory],
        className
      )}
    >
      {displayName}
    </span>
  );
}
