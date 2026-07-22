import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Rounded search field with a clear button. Controlled via value/onChange. */
const SearchInput = forwardRef(function SearchInput(
  { value, onChange, onClear, placeholder = 'Search recipes…', className, ...props },
  ref,
) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'h-12 w-full rounded-pill border border-primary-100 bg-white pl-12 pr-11 text-sm text-ink',
          'placeholder:text-muted/70 shadow-soft-sm',
          'focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary/15',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:bg-primary-50 hover:text-primary-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

export default SearchInput;
