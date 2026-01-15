'use client';

import { Control, FieldValues, Path } from 'react-hook-form';
import { ContactReadDto } from '@contact-tracker/api-models';
import EntityCombobox from '../common/entity-combobox';
import { contactComboboxConfig } from '../common/entity-combobox-config';

interface ContactComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<ContactReadDto[]>;
}

export function ContactCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
}: ContactComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={contactComboboxConfig}
    />
  );
}

export default ContactCombobox;
