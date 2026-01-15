'use client';

import { useEffect, useState, useRef } from 'react';
import { useController, Control, FieldValues, Path } from 'react-hook-form';
import { CompanyReadDto } from '@contact-tracker/api-models';

interface CompanyComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<CompanyReadDto[]>;
}

export function CompanyCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
}: CompanyComboboxProps<T>) {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control });

  const [query, setQuery] = useState(value?.name || '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CompanyReadDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Perform search
  useEffect(() => {
    let active = true;
    if (!debouncedQuery) {
      setSuggestions([]);
      return;
    }

    async function companiesSearch() {
      setIsLoading(true);

      try {
        const data = await onSearch(debouncedQuery);
        if (active) {
          setSuggestions(data || []);
        }
      } catch (error) {
        // TODO: log this
        console.error(error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    companiesSearch();

    // Cleanup prevents setting state on unmounted or stale effects
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // click outside or esc key on desktop
  useEffect(() => {
    // Click Outside Logic
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Escape Key Logic
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (company: CompanyReadDto) => {
    setQuery(company.name);
    setIsOpen(false);
    onChange({
      id: company.id,
      name: company.name,
      isNew: false,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    onChange({
      id: undefined,
      name: val,
      isNew: true,
    });
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search or Type New Company"
        />
        {isLoading && <span className="loading loading-ring loading-xs"></span>}
      </div>

      {isOpen && query.length > 0 && (
        <ul className="menu bg-base-200 w-full rounded-box absolute z-50 shadow-lg mt-1 max-h-60 overflow-auto">
          {/* Option to create new if no exact match */}
          {!suggestions.find((s) => s.name.toLowerCase() === query.toLowerCase()) && (
            <li className="text-primary italic">
              <button type="button" onClick={() => setIsOpen(false)}>
                Create new: "{query}"
              </button>
            </li>
          )}

          {suggestions.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => handleSelect(item)}>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <span className="text-error text-xs">{error.message}</span>}
    </div>
  );
}

export default CompanyCombobox;
