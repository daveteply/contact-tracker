import { ApiResult, Company } from '@contact-tracker/api-models';
import { getInternalApiBase } from '../api-base';
import { CompanyInput } from '@contact-tracker/validation';

export async function fetchCompanies(): Promise<Company[]> {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/companies`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch companies');
  }

  const result = (await res.json()) as ApiResult<Company[]>;
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch companies');
  }

  return result.data || [];
}

export async function fetchCompanyById(id: string) {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/companies/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch company');
  }

  return res.json();
}

export async function createCompany(data: CompanyInput) {
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
