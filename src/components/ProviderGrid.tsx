import { Provider } from '@/lib/parseCSV';
import { ProviderCard } from './ProviderCard';
import { SearchX } from 'lucide-react';
import { Button } from './ui/button';

interface ProviderGridProps {
  providers: Provider[];
  onClearFilters?: () => void;
}

export function ProviderGrid({ providers, onClearFilters }: ProviderGridProps) {
  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-1">No providers found</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {providers.map((provider, index) => (
        <ProviderCard 
          key={provider.id} 
          provider={provider} 
          index={index}
        />
      ))}
    </div>
  );
}
