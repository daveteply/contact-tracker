import { getInternalApiBase } from '../api-base';

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

export async function fetchContactById(id: string) {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/contacts/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch contact');
  }

  return res.json();
}

export async function createContact(data: unknown) {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create contact');
  }

  return res.json();
}

export async function updateContact(id: string, data: unknown) {
  const baseUrl = await getInternalApiBase();
  const res = await fetch(`${baseUrl}/api/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update contact');
  }

  return res.json();
}

export async function deleteContact(id: string) {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete contact');
  }

  return res.status === 204 ? null : res.json();
}
