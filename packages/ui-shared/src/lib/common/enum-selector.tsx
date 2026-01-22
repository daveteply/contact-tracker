'use client';

import { UseFormRegisterReturn } from 'react-hook-form';

interface EnumSelectorProps<T extends Record<string, string | number>> {
  enumObject: T;
  register: UseFormRegisterReturn;
  required?: boolean;
  useButtons?: boolean;
  defaultVale?: string;
}

export function EnumSelector<T extends Record<string, string | number>>({
  enumObject,
  register,
  required = false,
  useButtons = false,
  defaultVale = '',
}: EnumSelectorProps<T>) {
  const options = Object.entries(enumObject);

  return (
    <div>
      {useButtons ? (
        <div className="join">
          {options.map(([key, value]) => (
            <input
              key={key}
              className="join-item btn"
              type="radio"
              value={value}
              required={required}
              aria-label={key}
              {...register}
              defaultChecked={defaultVale === value}
            />
          ))}
        </div>
      ) : (
        <select className="select" {...register} defaultValue="" required={required}>
          <option value="" disabled>
            Select an option
          </option>
          {options.map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default EnumSelector;
