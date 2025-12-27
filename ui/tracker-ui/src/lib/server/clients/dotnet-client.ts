import { getInternalApiBase } from '../api';

export async function fetchContacts() {
  const baseUrl = await getInternalApiBase();

  const res = await fetch(`${baseUrl}/api/contacts`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return res.json();
}
