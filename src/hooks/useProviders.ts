import { useState, useEffect, useMemo, useCallback } from 'react';
import { Provider, ServiceCategory, parseCSV, getUniqueCountries, getUniqueCoverages, hasServiceCategory } from '@/lib/parseCSV';

// Fisher-Yates shuffle for unbiased randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states - now arrays for multi-select
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCoverages, setSelectedCoverages] = useState<string[]>([]);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);

  useEffect(() => {
    async function loadProviders() {
      try {
        // Bust any CDN/browser caching so data edits reflect immediately
        const url = `/data/providers.csv?v=${Date.now()}`;
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });
        if (!response.ok) throw new Error('Failed to load providers');
        const text = await response.text();
        const parsed = parseCSV(text);
        // Randomize order on each page load for fair exposure
        setProviders(shuffleArray(parsed));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, []);

  const countries = useMemo(() => getUniqueCountries(providers), [providers]);
  const coverages = useMemo(() => getUniqueCoverages(providers), [providers]);

  // Add/remove helpers for compound filters
  const addCountry = useCallback((country: string) => {
    setSelectedCountries(prev => prev.includes(country) ? prev : [...prev, country]);
  }, []);
  
  const removeCountry = useCallback((country: string) => {
    setSelectedCountries(prev => prev.filter(c => c !== country));
  }, []);

  const addCoverage = useCallback((coverage: string) => {
    setSelectedCoverages(prev => prev.includes(coverage) ? prev : [...prev, coverage]);
  }, []);
  
  const removeCoverage = useCallback((coverage: string) => {
    setSelectedCoverages(prev => prev.filter(c => c !== coverage));
  }, []);

  const addVoucher = useCallback((voucher: string) => {
    setSelectedVouchers(prev => prev.includes(voucher) ? prev : [...prev, voucher]);
  }, []);
  
  const removeVoucher = useCallback((voucher: string) => {
    setSelectedVouchers(prev => prev.filter(v => v !== voucher));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCountries([]);
    setSelectedCoverages([]);
    setSelectedVouchers([]);
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const allServiceNames = [
          ...provider.services.technical,
          ...provider.services.business,
          ...provider.services.social,
          ...provider.services.funding,
        ].map(s => s.name).join(' ');
        
        const searchFields = [
          provider.name,
          provider.country,
          provider.coverage,
          provider.description,
          allServiceNames,
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(query)) return false;
      }
      
      // Country filter - OR within (match any selected country)
      if (selectedCountries.length > 0 && !selectedCountries.includes(provider.country)) {
        return false;
      }

      // Coverage filter - OR within (match any selected coverage)
      if (selectedCoverages.length > 0 && !selectedCoverages.includes(provider.coverage)) {
        return false;
      }
      
      // Service category filter (PRIMARY FILTER)
      if (selectedServiceCategory !== 'all') {
        if (!hasServiceCategory(provider, selectedServiceCategory)) return false;
      }
      
      // Voucher type filter - OR within (match any selected voucher)
      if (selectedVouchers.length > 0) {
        const hasMatchingVoucher = provider.voucherTypes.some(v => selectedVouchers.includes(v));
        if (!hasMatchingVoucher) return false;
      }
      
      return true;
    });
  }, [providers, searchQuery, selectedCountries, selectedCoverages, selectedServiceCategory, selectedVouchers]);

  return {
    providers: filteredProviders,
    allProviders: providers,
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
  };
}
