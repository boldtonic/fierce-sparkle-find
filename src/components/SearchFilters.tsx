import { Search, X, Lightbulb, Rocket, TrendingUp, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedVoucher: string;
  onVoucherChange: (voucher: string) => void;
  countries: string[];
  totalResults: number;
}

const voucherTypes = [
  { value: 'all', label: 'All Types', icon: LayoutGrid, color: '' },
  { value: 'ideation', label: 'Ideation', icon: Lightbulb, color: 'text-ideation' },
  { value: 'scaleup', label: 'Scale-up', icon: Rocket, color: 'text-scaleup' },
  { value: 'commercialisation', label: 'Commercialisation', icon: TrendingUp, color: 'text-commercialisation' },
];

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedVoucher,
  onVoucherChange,
  countries,
  totalResults,
}: SearchFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCountry !== 'all' || selectedVoucher !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onCountryChange('all');
    onVoucherChange('all');
  };

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, country, or service..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-12 h-12 text-base bg-card border-border shadow-sm focus:shadow-md focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-secondary transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Country filter */}
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="w-full sm:w-[160px] h-10 bg-card">
                <SelectValue placeholder="All Countries" />
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

            {/* Voucher type pills */}
            <div className="flex flex-wrap gap-1.5">
              {voucherTypes.map(voucher => {
                const isSelected = selectedVoucher === voucher.value;
                const Icon = voucher.icon;
                return (
                  <button
                    key={voucher.value}
                    onClick={() => onVoucherChange(voucher.value)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isSelected 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'bg-card border border-border hover:bg-secondary text-foreground'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', !isSelected && voucher.color)} />
                    <span className="hidden sm:inline">{voucher.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count & clear */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totalResults}</span> 
              {' '}provider{totalResults !== 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
