import { Search, X, Wrench, Briefcase, Leaf, Coins, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
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
import { ServiceCategory } from '@/lib/parseCSV';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedServiceCategory: ServiceCategory | 'all';
  onServiceCategoryChange: (category: ServiceCategory | 'all') => void;
  selectedVoucher: string;
  onVoucherChange: (voucher: string) => void;
  countries: string[];
  totalResults: number;
}

const serviceCategories = [
  { value: 'all' as const, label: 'All Services', icon: null, color: '' },
  { value: 'technical' as const, label: 'Technical', icon: Wrench, color: 'bg-tag-technical/10 text-tag-technical border-tag-technical/30 hover:bg-tag-technical/20' },
  { value: 'business' as const, label: 'Business', icon: Briefcase, color: 'bg-tag-business/10 text-tag-business border-tag-business/30 hover:bg-tag-business/20' },
  { value: 'social' as const, label: 'Social/Environmental', icon: Leaf, color: 'bg-tag-social/10 text-tag-social border-tag-social/30 hover:bg-tag-social/20' },
  { value: 'funding' as const, label: 'Funding', icon: Coins, color: 'bg-tag-funding/10 text-tag-funding border-tag-funding/30 hover:bg-tag-funding/20' },
];

const voucherTypes = [
  { value: 'all', label: 'All Vouchers', icon: null },
  { value: 'ideation', label: 'Ideation €25K', icon: Lightbulb },
  { value: 'scaleup', label: 'Scale-up €50K', icon: Rocket },
  { value: 'commercialisation', label: 'Commercialisation €25K', icon: TrendingUp },
];

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedServiceCategory,
  onServiceCategoryChange,
  selectedVoucher,
  onVoucherChange,
  countries,
  totalResults,
}: SearchFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCountry !== 'all' || selectedServiceCategory !== 'all' || selectedVoucher !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onCountryChange('all');
    onServiceCategoryChange('all');
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

        {/* Service Category Filters - PRIMARY */}
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">Filter by Service Type</div>
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map(cat => {
              const isSelected = selectedServiceCategory === cat.value;
              return (
                <Button
                  key={cat.value}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onServiceCategoryChange(cat.value)}
                  className={cn(
                    'transition-all',
                    !isSelected && cat.color,
                    isSelected && 'shadow-md'
                  )}
                >
                  {cat.icon && <cat.icon className="w-4 h-4 mr-1.5" />}
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Secondary filters row */}
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

            {/* Voucher type filter - secondary dropdown */}
            <Select value={selectedVoucher} onValueChange={onVoucherChange}>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue placeholder="All Vouchers" />
              </SelectTrigger>
              <SelectContent>
                {voucherTypes.map(voucher => (
                  <SelectItem key={voucher.value} value={voucher.value}>
                    <span className="flex items-center gap-2">
                      {voucher.icon && <voucher.icon className="w-4 h-4" />}
                      {voucher.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
