'use client';

import { Control, FieldValues, Path } from 'react-hook-form';
import EntityCombobox from '../entity-combobox';
import { companyComboboxConfig } from '../entity-combobox-config';
import { CompanyDocumentDto } from '@contact-tracker/api-models';

interface CompanyComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<CompanyDocumentDto[]>;
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
