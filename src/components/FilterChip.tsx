import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
  variant?: 'country' | 'coverage' | 'voucher';
}

export function FilterChip({ label, value, onRemove, variant = 'country' }: FilterChipProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
        variant === 'country' && 'bg-primary/10 text-primary border-primary/20',
        variant === 'coverage' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        variant === 'voucher' && 'bg-accent/10 text-accent-foreground border-accent/20'
      )}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 p-0.5 rounded-full hover:bg-background/50 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
