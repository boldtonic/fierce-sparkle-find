import { useState } from 'react';
import { Search, X, Wrench, Briefcase, Leaf, Coins, Plus, MapPin, Ticket, Globe2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ServiceCategory } from '@/lib/parseCSV';
import { FilterChip } from './FilterChip';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedCoverage: string;
  onCoverageChange: (coverage: string) => void;
  selectedServiceCategory: ServiceCategory | 'all';
  onServiceCategoryChange: (category: ServiceCategory | 'all') => void;
  selectedVoucher: string;
  onVoucherChange: (voucher: string) => void;
  countries: string[];
  coverages: string[];
  totalResults: number;
}

const serviceCategories = [
  { value: 'all' as const, label: 'All', icon: null, color: '' },
  { value: 'technical' as const, label: 'Technical', icon: Wrench, color: 'bg-tag-technical/10 text-tag-technical border-tag-technical/30 hover:bg-tag-technical/20' },
  { value: 'business' as const, label: 'Business', icon: Briefcase, color: 'bg-tag-business/10 text-tag-business border-tag-business/30 hover:bg-tag-business/20' },
  { value: 'social' as const, label: 'Social', icon: Leaf, color: 'bg-tag-social/10 text-tag-social border-tag-social/30 hover:bg-tag-social/20' },
  { value: 'funding' as const, label: 'Funding', icon: Coins, color: 'bg-tag-funding/10 text-tag-funding border-tag-funding/30 hover:bg-tag-funding/20' },
];

const voucherLabels: Record<string, string> = {
  ideation: 'Ideation €25K',
  scaleup: 'Scale-up €50K',
  commercialisation: 'Commercialisation €25K',
};

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedCoverage,
  onCoverageChange,
  selectedServiceCategory,
  onServiceCategoryChange,
  selectedVoucher,
  onVoucherChange,
  countries,
  coverages,
  totalResults,
}: SearchFiltersProps) {
  const [addFilterOpen, setAddFilterOpen] = useState(false);

  const hasActiveSecondaryFilters = selectedCountry !== 'all' || selectedCoverage !== 'all' || selectedVoucher !== 'all';

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 py-3">
      <div className="container mx-auto px-4">
        {/* Single row filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9 text-sm bg-card border-border/50"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {selectedCountry !== 'all' && (
            <FilterChip
              label="Country"
              value={selectedCountry}
              onRemove={() => onCountryChange('all')}
              variant="country"
            />
          )}
          {selectedCoverage !== 'all' && (
            <FilterChip
              label="Coverage"
              value={selectedCoverage}
              onRemove={() => onCoverageChange('all')}
              variant="coverage"
            />
          )}
          {selectedVoucher !== 'all' && (
            <FilterChip
              label="Voucher"
              value={voucherLabels[selectedVoucher] || selectedVoucher}
              onRemove={() => onVoucherChange('all')}
              variant="voucher"
            />
          )}

          {/* Service category pills */}
          <div className="flex items-center gap-1.5 border-l border-border/50 pl-3">
            {serviceCategories.map(cat => {
              const isSelected = selectedServiceCategory === cat.value;
              return (
                <Button
                  key={cat.value}
                  variant={isSelected ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onServiceCategoryChange(cat.value)}
                  className={cn(
                    'h-8 px-3 text-xs transition-all',
                    !isSelected && cat.color,
                    !isSelected && !cat.color && 'hover:bg-muted',
                    isSelected && 'shadow-sm'
                  )}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5 mr-1" />}
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Add filter button */}
          <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-card" align="start">
              <div className="space-y-3">
                {/* Country filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Country (HQ)
                  </label>
                  <Select 
                    value={selectedCountry} 
                    onValueChange={(val) => {
                      onCountryChange(val);
                      if (val !== 'all') setAddFilterOpen(false);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Coverage filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <Globe2 className="w-3.5 h-3.5" />
                    Geographical Coverage
                  </label>
                  <Select 
                    value={selectedCoverage} 
                    onValueChange={(val) => {
                      onCoverageChange(val);
                      if (val !== 'all') setAddFilterOpen(false);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Coverage</SelectItem>
                      {coverages.map(coverage => (
                        <SelectItem key={coverage} value={coverage}>
                          {coverage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Voucher type filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    Voucher Type
                  </label>
                  <Select 
                    value={selectedVoucher} 
                    onValueChange={(val) => {
                      onVoucherChange(val);
                      if (val !== 'all') setAddFilterOpen(false);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select voucher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vouchers</SelectItem>
                      <SelectItem value="ideation">Ideation €25K</SelectItem>
                      <SelectItem value="scaleup">Scale-up €50K</SelectItem>
                      <SelectItem value="commercialisation">Commercialisation €25K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveSecondaryFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onCountryChange('all');
                      onCoverageChange('all');
                      onVoucherChange('all');
                      setAddFilterOpen(false);
                    }}
                    className="w-full h-7 text-xs text-muted-foreground"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Results count */}
          <div className="ml-auto text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalResults}</span> provider{totalResults !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
