'use client';

import { Control, FieldValues, Path } from 'react-hook-form';
import { CompanyReadDto } from '@contact-tracker/api-models';
import EntityCombobox from '../common/entity-combobox';
import { companyComboboxConfig } from '../common/entity-combobox-config';

interface CompanyComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<CompanyReadDto[]>;
  required?: boolean;
}

export function CompanyCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
}: CompanyComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={companyComboboxConfig}
      required={required}
    />
  );
}

export default CompanyCombobox;
