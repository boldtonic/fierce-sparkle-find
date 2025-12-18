import { getServiceCategory } from '@/lib/parseCSV';
import { cn } from '@/lib/utils';

interface ServiceTagProps {
  service: string;
  className?: string;
}

export function ServiceTag({ service, className }: ServiceTagProps) {
  const category = getServiceCategory(service);
  
  // Extract just the service name (after the category prefix)
  const displayName = service.includes('|') 
    ? service.split('|')[1]?.trim() 
    : service;
  
  const categoryStyles = {
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
        categoryStyles[category],
        className
      )}
    >
      {displayName}
    </span>
  );
}
