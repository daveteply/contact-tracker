'use client';

import { Control, FieldValues, Path } from 'react-hook-form';
import EntityCombobox from '../common/entity-combobox';
import { roleComboboxConfig } from '../common/entity-combobox-config';
import { RoleReadDto } from '@contact-tracker/api-models';

interface RoleComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<RoleReadDto[]>;
  required?: boolean;
}

export function RoleCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
}: RoleComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={roleComboboxConfig}
      required={required}
    />
  );
}

export default RoleCombobox;
