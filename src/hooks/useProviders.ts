import { useState, useEffect, useMemo } from 'react';
import { Provider, parseCSV, getUniqueCountries } from '@/lib/parseCSV';

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState('all');

  useEffect(() => {
    async function loadProviders() {
      try {
        const response = await fetch('/data/providers.csv');
        if (!response.ok) throw new Error('Failed to load providers');
        const text = await response.text();
        const parsed = parseCSV(text);
        setProviders(parsed);

        // Temporary debug (DEV only)
        if (import.meta.env.DEV) {
          const sample = parsed.slice(0, 3).map((p) => ({
            name: p.name,
            country: p.country,
            ideation: p.ideation.length,
            scaleup: p.scaleup.length,
            commercialisation: p.commercialisation.length,
          }));
          // eslint-disable-next-line no-console
          console.debug('[providers] parsed', {
            count: parsed.length,
            sample,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, []);

  const countries = useMemo(() => getUniqueCountries(providers), [providers]);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          provider.name,
          provider.country,
          provider.coverage,
          provider.description,
          ...provider.ideation,
          ...provider.scaleup,
          ...provider.commercialisation,
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(query)) return false;
      }
      
      // Country filter
      if (selectedCountry !== 'all' && provider.country !== selectedCountry) {
        return false;
      }
      
      // Voucher type filter
      if (selectedVoucher !== 'all') {
        if (selectedVoucher === 'ideation' && provider.ideation.length === 0) return false;
        if (selectedVoucher === 'scaleup' && provider.scaleup.length === 0) return false;
        if (selectedVoucher === 'commercialisation' && provider.commercialisation.length === 0) return false;
      }
      
      return true;
    });
  }, [providers, searchQuery, selectedCountry, selectedVoucher]);

  return {
    providers: filteredProviders,
    allProviders: providers,
    loading,
    error,
    countries,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    selectedVoucher,
    setSelectedVoucher,
  };
}
