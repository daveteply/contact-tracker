'use client';

import { ContactReadDto } from '@contact-tracker/api-models';
import { BaseTypeAhead } from './base-type-ahead';

interface ContactTypeAheadProps {
  value?: ContactReadDto | null;
  onChange: (value: ContactReadDto | null) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  onCreate?: () => void;
  onEdit?: (contact: ContactReadDto) => void;
  onView?: (contact: ContactReadDto) => void;
}

export function ContactTypeAhead(props: ContactTypeAheadProps) {
  const handleSearch = async (query: string): Promise<ContactReadDto[]> => {
    // Backend handles first and/or last name matching
    const response = await fetch(
      `/api/contacts/search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  };

  return (
    <BaseTypeAhead<ContactReadDto>
      {...props}
      onSearch={handleSearch}
      displayField="firstName"
      label="Contact"
      placeholder="Search contacts by name..."
    />
  );
}
