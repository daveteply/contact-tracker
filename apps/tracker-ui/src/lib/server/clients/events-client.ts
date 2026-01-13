import {
  ApiResult,
  EventCreateDto,
  EventReadDto,
  EventUpdateDto,
} from '@contact-tracker/api-models';
import { getInternalApiBase } from '../api-base';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const baseUrl = await getInternalApiBase();
  const url = `${baseUrl}/api/events${endpoint}`;

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

export async function fetchEvents(): Promise<EventReadDto[]> {
  const result = await apiRequest<EventReadDto[]>('', { cache: 'no-store' });

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch events');
  }

  return result.data || [];
}

export async function fetchEventById(id: number) {
  return apiRequest<EventReadDto>(`/${id}`, { cache: 'no-store' });
}

export async function createEvent(data: EventCreateDto) {
  return apiRequest<EventReadDto>('', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateEvent(id: number, data: EventUpdateDto) {
  return apiRequest<EventReadDto>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: number) {
  return apiRequest<void>(`/${id}`, {
    method: 'DELETE',
  });
}
