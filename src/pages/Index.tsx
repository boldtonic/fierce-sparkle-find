import { HeroSection } from '@/components/HeroSection';
import { SearchFilters } from '@/components/SearchFilters';
import { ProviderGrid } from '@/components/ProviderGrid';
import { useProviders } from '@/hooks/useProviders';
import { Loader2 } from 'lucide-react';
import fierceLogo from '@/assets/fierce-logo-color.png';
import euFundingLogo from '@/assets/eu-funding.jpg';

const Index = () => {
  const {
    providers,
    loading,
    error,
    countries,
    coverages,
    searchQuery,
    setSearchQuery,
    selectedCountries,
    addCountry,
    removeCountry,
    selectedCoverages,
    addCoverage,
    removeCoverage,
    selectedServiceCategory,
    setSelectedServiceCategory,
    selectedVouchers,
    addVoucher,
    removeVoucher,
    clearAllFilters,
  } = useProviders();

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCountries={selectedCountries}
        onCountryAdd={addCountry}
        onCountryRemove={removeCountry}
        selectedCoverages={selectedCoverages}
        onCoverageAdd={addCoverage}
        onCoverageRemove={removeCoverage}
        selectedServiceCategory={selectedServiceCategory}
        onServiceCategoryChange={setSelectedServiceCategory}
        selectedVouchers={selectedVouchers}
        onVoucherAdd={addVoucher}
        onVoucherRemove={removeVoucher}
        onClearAllFilters={clearAllFilters}
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
            
            {/* EU Funding Disclaimer */}
            <div className="mt-6 pt-6 border-t border-border/50 flex flex-row items-center gap-4 max-w-4xl">
              <img 
                src={euFundingLogo} 
                alt="Funded by the European Union" 
                className="h-10 w-auto flex-shrink-0"
              />
              <p className="text-xs text-muted-foreground text-left leading-relaxed">
                Funded by the European Union under GA no. 101177496. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or HaDEA. Neither the European Union nor the granting authority can be held responsible for them.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
