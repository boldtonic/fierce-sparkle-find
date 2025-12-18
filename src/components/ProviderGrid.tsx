import { Provider } from '@/lib/parseCSV';
import { ProviderCard } from './ProviderCard';
import { SearchX } from 'lucide-react';

interface ProviderGridProps {
  providers: Provider[];
}

export function ProviderGrid({ providers }: ProviderGridProps) {
  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">No providers found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search query or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
