import { ApiResult } from '@contact-tracker/api-models';
import { getInternalApiBase } from '../../api-base';

export async function coreApiRequest<T>(
  resourcePath: string,
  endpoint: string,
  options: RequestInit = {},
  params?: URLSearchParams,
): Promise<ApiResult<T>> {
  const baseUrl = await getInternalApiBase();
  const paramString = params ? `?${params.toString()}` : '';
  const url = `${baseUrl}/api/${resourcePath}${endpoint}${paramString}`;

  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
