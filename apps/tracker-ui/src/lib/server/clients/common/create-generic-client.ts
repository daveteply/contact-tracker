import { coreApiRequest } from './core-api-request';

export function createGenericClient<TRead, TCreate, TUpdate>(resourcePath: string) {
  return {
    fetchAll: async () => {
      const result = await coreApiRequest<TRead[]>(resourcePath, '', { cache: 'no-store' });
      if (!result.success) throw new Error(result.message);
      return result.data || [];
    },

    fetchById: (id: number) => coreApiRequest<TRead>(resourcePath, `/${id}`, { cache: 'no-store' }),

    create: (data: TCreate) =>
      coreApiRequest<TRead>(resourcePath, '', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: TUpdate) =>
      coreApiRequest<TRead>(resourcePath, `/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: number) => coreApiRequest<void>(resourcePath, `/${id}`, { method: 'DELETE' }),

    search: async (query: string) => {
      const result = await coreApiRequest<TRead[]>(resourcePath, `/search?q=${query}`, {
        cache: 'no-store',
      });
      if (!result.success) throw new Error(result.message);
      return result.data || [];
    },
  };
}
