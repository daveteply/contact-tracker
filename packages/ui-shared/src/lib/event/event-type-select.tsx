'use client';

import { EventTypeReadDto } from '@contact-tracker/api-models';
import { useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface EventTypeSelectProps {
  label?: string;
  register: UseFormRegisterReturn;
  onFetchEventTypes: () => Promise<EventTypeReadDto[]>;
  error?: string;
}

export function EventTypeSelect({
  label,
  register,
  onFetchEventTypes,
  error,
}: EventTypeSelectProps) {
  const [eventTypes, setEventTypes] = useState<EventTypeReadDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await onFetchEventTypes();
        setEventTypes(data);
      } catch (err) {
        console.error('Failed to load event types', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [onFetchEventTypes]);

  return (
    <fieldset className="fieldset w-full">
      {label && <legend className="fieldset-legend">{label}</legend>}

      <div className="relative w-full">
        <select
          {...register}
          className={`select w-full ${error ? 'select-error' : ''}`}
          disabled={isLoading}
          defaultValue=""
        >
          <option value="" disabled>
            {isLoading ? 'Loading event types...' : 'Select an event type'}
          </option>

          {eventTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <span className="loading loading-bars loading-xs text-primary"></span>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </fieldset>
  );
}
