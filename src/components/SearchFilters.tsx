import { Search, X, Filter, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const voucherTypes = [
    { value: 'all', label: 'All Vouchers', icon: null },
    { value: 'ideation', label: 'Ideation (€25K)', icon: Lightbulb },
    { value: 'scaleup', label: 'Scale-up (€50K)', icon: Rocket },
    { value: 'commercialisation', label: 'Commercialisation (€25K)', icon: TrendingUp },
  ];

  const hasActiveFilters = searchQuery || selectedCountry !== 'all' || selectedVoucher !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onCountryChange('all');
    onVoucherChange('all');
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 py-4">
      <div className="container mx-auto px-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search providers by name, country, or services..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-12 py-6 text-base bg-card border-border/50 shadow-card focus:shadow-card-hover transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {/* Country filter */}
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="w-[180px] bg-card">
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

            {/* Voucher type filter */}
            <div className="flex gap-2">
              {voucherTypes.map(voucher => (
                <Button
                  key={voucher.value}
                  variant={selectedVoucher === voucher.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onVoucherChange(voucher.value)}
                  className={cn(
                    'transition-all',
                    selectedVoucher === voucher.value && 'shadow-md'
                  )}
                >
                  {voucher.icon && <voucher.icon className="w-4 h-4 mr-1.5" />}
                  <span className="hidden sm:inline">{voucher.label}</span>
                  <span className="sm:hidden">
                    {voucher.value === 'all' ? 'All' : voucher.label.split(' ')[0]}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Results count & clear */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalResults}</span> provider{totalResults !== 1 ? 's' : ''} found
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
