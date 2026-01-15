'use server';

import {
  ApiResult,
  ContactCreateDto,
  ContactReadDto,
  ContactUpdateDto,
} from '@contact-tracker/api-models';
import { getInternalApiBase } from '../api-base';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const baseUrl = await getInternalApiBase();
  const url = `${baseUrl}/api/contacts${endpoint}`;

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

export async function fetchContacts(): Promise<ContactReadDto[]> {
  const result = await apiRequest<ContactReadDto[]>('', { cache: 'no-store' });

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch contacts');
  }

  return result.data || [];
}

export async function fetchContactById(id: number) {
  return apiRequest<ContactReadDto>(`/${id}`, { cache: 'no-store' });
}

export async function createContact(data: ContactCreateDto) {
  return apiRequest<ContactReadDto>('', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContact(id: number, data: ContactUpdateDto) {
  return apiRequest<ContactReadDto>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteContact(id: number) {
  return apiRequest<void>(`/${id}`, {
    method: 'DELETE',
  });
}
