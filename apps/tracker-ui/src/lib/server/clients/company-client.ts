import {
  ApiResult,
  CompanyCreateDto,
  CompanyReadDto,
  CompanyUpdateDto,
} from '@contact-tracker/api-models';
import { getInternalApiBase } from '../api-base';

export async function fetchCompanies(): Promise<CompanyReadDto[]> {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/companies`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch companies');
  }

  const result = (await res.json()) as ApiResult<CompanyReadDto[]>;
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch companies');
  }

  return result.data || [];
}

export async function fetchCompanyById(
  id: number,
): Promise<ApiResult<CompanyReadDto>> {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/companies/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch company');
  }

  return res.json();
}

export async function createCompany(data: CompanyCreateDto) {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create company');
  }

  return res.json();
}

export async function updateCompany(id: number, data: CompanyUpdateDto) {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update company');
  }

  return res.json();
}

export async function deleteCompany(id: number) {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/companies/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete company');
  }

  return res.json();
}
