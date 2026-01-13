'use client';

import { RoleReadDto } from '@contact-tracker/api-models';
import { BaseTypeAhead } from './base-type-ahead';

interface RoleTypeAheadProps {
  value?: RoleReadDto | null;
  onChange: (value: RoleReadDto | null) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  onCreate?: () => void;
  onEdit?: (role: RoleReadDto) => void;
  onView?: (role: RoleReadDto) => void;
}

export function RoleTypeAhead(props: RoleTypeAheadProps) {
  const handleSearch = async (query: string): Promise<RoleReadDto[]> => {
    // Replace with your actual API call
    const response = await fetch(
      `/api/roles/search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  };

  return (
    <BaseTypeAhead<RoleReadDto>
      {...props}
      onSearch={handleSearch}
      displayField="title"
      label="Role"
      placeholder="Search roles by title..."
    />
  );
}
