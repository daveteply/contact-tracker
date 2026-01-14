'use client';

import { ApiResult, CompanyReadDto } from '@contact-tracker/api-models';
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
    const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');

    const result: ApiResult<CompanyReadDto[]> = await response.json();

    if (!result.success) {
      console.error('API Errors:', result.errors);
      throw new Error(result.message || 'Search failed');
    }

    return result.data ?? [];
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
