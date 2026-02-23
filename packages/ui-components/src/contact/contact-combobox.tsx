'use client';

import { Control, FieldValues, Path } from 'react-hook-form';
import { ContactReadDto } from '@contact-tracker/api-models';
// import EntityCombobox from '../entity-combobox';
// import { contactComboboxConfig } from '../entity-combobox-config';

interface ContactComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<ContactReadDto[]>;
  required?: boolean;
}

export function ContactCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
}: ContactComboboxProps<T>) {
  return (
    <div>TODO</div>
    // <EntityCombobox
    //   control={control}
    //   name={name}
    //   onSearch={onSearch}
    //   config={contactComboboxConfig}
    //   required={required}
    // />
  );
}

export default ContactCombobox;
