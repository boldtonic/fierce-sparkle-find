import { HeroSection } from '@/components/HeroSection';
import { SearchFilters } from '@/components/SearchFilters';
import { ProviderGrid } from '@/components/ProviderGrid';
import { useProviders } from '@/hooks/useProviders';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    providers,
    loading,
    error,
    countries,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    selectedVoucher,
    setSelectedVoucher,
  } = useProviders();

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedVoucher('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedVoucher={selectedVoucher}
        onVoucherChange={setSelectedVoucher}
        countries={countries}
        totalResults={providers.length}
      />
      
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading providers...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium mb-1">Error loading data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <ProviderGrid providers={providers} onClearFilters={clearFilters} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display font-semibold text-foreground mb-1">FIERCE Programme</p>
          <p className="text-sm text-muted-foreground">
            External Service Provider Catalogue for SMEs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
