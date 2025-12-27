import 'server-only';

import { headers } from 'next/headers';

export async function getInternalApiBase() {
  const headersList = await headers();
  const host = headersList.get('host');

  if (!host) {
    throw new Error('Unable to determine host');
  }

  return `http://${host}`;
}
