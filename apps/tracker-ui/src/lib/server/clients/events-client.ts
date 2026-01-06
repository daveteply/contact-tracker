import { getInternalApiBase } from '../api-base';

export async function fetchEvents() {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/events`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  return res.json();
}
