'use server';

import {
  ApiResult,
  CompanyCreateDto,
  CompanyReadDto,
  CompanyUpdateDto,
} from '@contact-tracker/api-models';
import { getInternalApiBase } from '../api-base';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const baseUrl = await getInternalApiBase();
  const url = `${baseUrl}/api/companies${endpoint}`;

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

export async function fetchCompanies(): Promise<CompanyReadDto[]> {
  const result = await apiRequest<CompanyReadDto[]>('', { cache: 'no-store' });

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch companies');
  }

  return result.data || [];
}

export async function searchCompanies(query: string): Promise<CompanyReadDto[]> {
  const result = await apiRequest<CompanyReadDto[]>(`/search?q=${query}`, { cache: 'no-store' });

  if (!result.success) {
    throw new Error(result.message || 'Failed to search companies');
  }

  return result.data || [];
}

export async function fetchCompanyById(id: number) {
  return apiRequest<CompanyReadDto>(`/${id}`, { cache: 'no-store' });
}

export async function createCompany(data: CompanyCreateDto) {
  return apiRequest<CompanyReadDto>('', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCompany(id: number, data: CompanyUpdateDto) {
  return apiRequest<CompanyReadDto>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCompany(id: number) {
  return apiRequest<void>(`/${id}`, {
    method: 'DELETE',
  });
}
