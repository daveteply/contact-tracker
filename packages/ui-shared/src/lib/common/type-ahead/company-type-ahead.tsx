'use client';

import { CompanyReadDto } from '@contact-tracker/api-models';
import { BaseTypeAhead } from './base-type-ahead';

interface CompanyTypeAheadProps {
  value?: CompanyReadDto | null;
  onChange: (value: CompanyReadDto | null) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  onCreate?: () => void;
  onEdit?: (company: CompanyReadDto) => void;
  onView?: (company: CompanyReadDto) => void;
}

export function CompanyTypeAhead(props: CompanyTypeAheadProps) {
  const handleSearch = async (query: string): Promise<CompanyReadDto[]> => {
    // Replace with your actual API call
    const response = await fetch(
      `/api/companies/search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  };

  return (
    <BaseTypeAhead<CompanyReadDto>
      {...props}
      onSearch={handleSearch}
      displayField="name"
      label="Company"
      placeholder="Search companies by name..."
    />
  );
}
