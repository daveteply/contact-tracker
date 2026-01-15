'use server';

import { ApiResult, RoleReadDto } from '@contact-tracker/api-models';
import { getInternalApiBase } from '../api-base';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const baseUrl = await getInternalApiBase();
  const url = `${baseUrl}/api/roles${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function searchRoles(query: string): Promise<RoleReadDto[]> {
  const result = await apiRequest<RoleReadDto[]>(`/search?q=${query}`, { cache: 'no-store' });

  if (!result.success) {
    throw new Error(result.message || 'Failed to search companies');
  }

  return result.data || [];
}
