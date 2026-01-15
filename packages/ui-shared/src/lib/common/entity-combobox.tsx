'use client';

import { useEffect, useState, useRef } from 'react';
import { useController, Control, FieldValues, Path } from 'react-hook-form';

// Configuration for how the EntityCombobox should handle a specific entity type

export interface EntityComboboxConfig<TEntity, TFormValue> {
  // Extract the display value from an entity (e.g., company.name
  //   or `${contact.firstName} ${contact.lastName}`)
  getDisplayValue: (entity: TEntity) => string;

  // Parse user input into the form value shape when creating a new entity
  // Return null if the input is invalid
  parseNewEntity: (input: string) => TFormValue | null;

  // Optional: Validate that a new entity can be created from the input
  //   Return an error message if invalid, or null if valid
  validateNewEntity?: (input: string) => string | null;

  // Placeholder text for the input field
  placeholder: string;

  // Label for the "create new" option (e.g., "Create new company: {input}")
  createNewLabel?: (input: string) => string;
}

interface EntityComboboxProps<TEntity, T extends FieldValues, TFormValue> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<TEntity[]>;
  config: EntityComboboxConfig<TEntity, TFormValue>;
}

export function EntityCombobox<TEntity extends { id: number }, T extends FieldValues, TFormValue>({
  control,
  name,
  onSearch,
  config,
}: EntityComboboxProps<TEntity, T, TFormValue>) {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control });

  const [query, setQuery] = useState(
    value && !value.isNew ? config.getDisplayValue(value) : value?.displayValue || '',
  );
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TEntity[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

    async function entitySearch() {
      setIsLoading(true);

      try {
        const data = await onSearch(debouncedQuery);
        if (active) {
          setSuggestions(data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    entitySearch();

    return () => {
      active = false;
    };
  }, [debouncedQuery, onSearch]);

  // Click outside or esc key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

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

  const handleSelect = (entity: TEntity) => {
    const displayValue = config.getDisplayValue(entity);
    setQuery(displayValue);
    setIsOpen(false);
    setValidationError(null);
    onChange({
      ...entity,
      isNew: false,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    // Validate the input for new entity creation
    const validationErr = config.validateNewEntity?.(val) || null;
    setValidationError(validationErr);

    // Parse the input into the form value
    const parsed = config.parseNewEntity(val);

    onChange({
      ...parsed,
      displayValue: val,
      isNew: true,
    });
  };

  // Check if there's an exact match in suggestions
  const hasExactMatch = suggestions.some(
    (s) => config.getDisplayValue(s).toLowerCase() === query.toLowerCase(),
  );

  // Determine if we should show the "create new" option
  const showCreateNew = query.length > 0 && !hasExactMatch && !validationError;

  const createNewLabel = config.createNewLabel
    ? config.createNewLabel(query)
    : `Create new: "${query}"`;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={config.placeholder}
          disabled={isLoading}
        />
        {isLoading && (
          <span className="loading loading-bars loading-xs absolute inset-y-0 left-2 flex items-center pr-3 text-primary"></span>
        )}
      </div>

      {isOpen && query.length > 0 && (
        <ul className="menu bg-base-200 w-full rounded-box absolute z-50 shadow-lg mt-1 max-h-60 overflow-auto">
          {/* Show create new option */}
          {showCreateNew && (
            <li className="text-primary italic">
              <button type="button" onClick={() => setIsOpen(false)}>
                {createNewLabel}
              </button>
            </li>
          )}

          {/* Show validation error if present */}
          {validationError && (
            <li className="text-error italic">
              <span className="px-4 py-2">{validationError}</span>
            </li>
          )}

          {/* Show suggestions */}
          {suggestions.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => handleSelect(item)}>
                {config.getDisplayValue(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <span className="text-error text-xs">{error.message}</span>}
    </div>
  );
}

export default EntityCombobox;
