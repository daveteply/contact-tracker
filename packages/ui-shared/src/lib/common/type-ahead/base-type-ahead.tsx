'use client';

import { useState, useRef, useEffect } from 'react';
import { BaseEntity, TypeAheadProps } from './types';

export function BaseTypeAhead<T extends BaseEntity>({
  value,
  onChange,
  onSearch,
  displayField,
  placeholder = 'Search...',
  label,
  error,
  disabled = false,
  onCreate,
  onEdit,
  onView,
  required = false,
  className = '',
}: TypeAheadProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  const handleSelect = (item: T) => {
    onChange(item);
    setQuery('');
    setIsOpen(false);
    setFocused(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setResults([]);
  };

  const handleInputFocus = () => {
    setFocused(true);
    if (query.trim().length > 0 && results.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle clicks outside
  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const items = await onSearch(query);
        setResults(items);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch]);

  return (
    <div className={`form-control w-full ${className}`} ref={wrapperRef}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        {/* Selected Value Display */}
        {value && !focused ? (
          <div className="flex items-center gap-2">
            <div className="input input-bordered flex-1 flex items-center justify-between">
              <span className="flex-1">{String(value[displayField])}</span>
              <div className="flex gap-1">
                {onView && (
                  <button
                    type="button"
                    onClick={() => onView(value)}
                    className="btn btn-ghost btn-xs btn-circle"
                    title="View"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                )}
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(value)}
                    className="btn btn-ghost btn-xs btn-circle"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-ghost btn-xs btn-circle"
                  title="Clear"
                  disabled={disabled}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              disabled={disabled}
              className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
            />

            {/* Loading Spinner */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            )}

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-2 hover:bg-base-200 focus:bg-base-200 focus:outline-none"
                  >
                    {String(item[displayField])}
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {isOpen &&
              !loading &&
              query.trim().length > 0 &&
              results.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg">
                  <div className="px-4 py-2 text-base-content/60">
                    No results found
                  </div>
                  {onCreate && (
                    <button
                      type="button"
                      onClick={onCreate}
                      className="w-full text-left px-4 py-2 hover:bg-base-200 text-primary font-medium"
                    >
                      + Create New
                    </button>
                  )}
                </div>
              )}
          </>
        )}

        {/* Create Button (when no value selected) */}
        {!value && !focused && onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
            title="Create New"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
