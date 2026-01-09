import { ApiResult, Company } from '@contact-tracker/api-models';
import { getInternalApiBase } from '../api-base';

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
