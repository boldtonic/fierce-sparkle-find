import { HeroSection } from '@/components/HeroSection';
import { SearchFilters } from '@/components/SearchFilters';
import { ProviderGrid } from '@/components/ProviderGrid';
import { useProviders } from '@/hooks/useProviders';
import { Loader2 } from 'lucide-react';
import fierceLogo from '@/assets/fierce-logo-color.png';

const Index = () => {
  const {
    providers,
    loading,
    error,
    countries,
    coverages,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    selectedCoverage,
    setSelectedCoverage,
    selectedServiceCategory,
    setSelectedServiceCategory,
    selectedVoucher,
    setSelectedVoucher,
  } = useProviders();

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedCoverage={selectedCoverage}
        onCoverageChange={setSelectedCoverage}
        selectedServiceCategory={selectedServiceCategory}
        onServiceCategoryChange={setSelectedServiceCategory}
        selectedVoucher={selectedVoucher}
        onVoucherChange={setSelectedVoucher}
        countries={countries}
        coverages={coverages}
        totalResults={providers.length}
      />
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading providers...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium mb-2">Error loading data</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <ProviderGrid providers={providers} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <img 
              src={fierceLogo} 
              alt="FIERCE Programme Logo" 
              className="h-12 w-auto opacity-80"
            />
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-display font-semibold text-foreground mb-2">FIERCE Programme</p>
              <p className="mb-4">External Service Provider Catalogue for SMEs</p>
              <p className="text-xs">
                <a 
                  href="https://project-fierce.eu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  project-fierce.eu
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
