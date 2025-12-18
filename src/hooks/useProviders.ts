import { useState, useEffect, useMemo } from 'react';
import { Provider, ServiceCategory, parseCSV, getUniqueCountries, getUniqueCoverages, hasServiceCategory } from '@/lib/parseCSV';

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCoverage, setSelectedCoverage] = useState('all');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedVoucher, setSelectedVoucher] = useState('all');

  useEffect(() => {
    async function loadProviders() {
      try {
        const response = await fetch('/data/providers.csv');
        if (!response.ok) throw new Error('Failed to load providers');
        const text = await response.text();
        const parsed = parseCSV(text);
        setProviders(parsed);
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
      
      // Country filter
      if (selectedCountry !== 'all' && provider.country !== selectedCountry) {
        return false;
      }

      // Coverage filter
      if (selectedCoverage !== 'all' && provider.coverage !== selectedCoverage) {
        return false;
      }
      
      // Service category filter (PRIMARY FILTER)
      if (selectedServiceCategory !== 'all') {
        if (!hasServiceCategory(provider, selectedServiceCategory)) return false;
      }
      
      // Voucher type filter (secondary)
      if (selectedVoucher !== 'all') {
        if (!provider.voucherTypes.includes(selectedVoucher as any)) return false;
      }
      
      return true;
    });
  }, [providers, searchQuery, selectedCountry, selectedCoverage, selectedServiceCategory, selectedVoucher]);

  return {
    providers: filteredProviders,
    allProviders: providers,
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
  };
}
