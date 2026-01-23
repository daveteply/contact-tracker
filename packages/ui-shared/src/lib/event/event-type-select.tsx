'use client';

import { EventTypeReadDto } from '@contact-tracker/api-models';
import { useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface EventTypeSelectProps {
  register: UseFormRegisterReturn;
  onFetchEventTypes: () => Promise<EventTypeReadDto[]>;
  error?: string;
  required?: boolean;
}

export function EventTypeSelect({
  register,
  onFetchEventTypes,
  error,
  required = false,
}: EventTypeSelectProps) {
  const [eventTypes, setEventTypes] = useState<EventTypeReadDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const data = await onFetchEventTypes();
        if (isMounted) {
          setEventTypes(data);
        }
      } catch (err) {
        console.error('Failed to load event types', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [onFetchEventTypes]);

  const showSpinner = isLoading;

  return (
    <div className="relative w-full">
      <select
        {...register}
        className={`select w-full ${error ? 'select-error' : ''}`}
        disabled={isLoading}
        required={required}
      >
        <option value="">{isLoading ? 'Loading event types...' : 'Select an event type'}</option>

        {eventTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      {showSpinner && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <span className="loading loading-bars loading-xs text-primary"></span>
        </div>
      )}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default EventTypeSelect;
