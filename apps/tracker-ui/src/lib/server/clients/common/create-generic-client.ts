import { coreApiRequest } from './core-api-request';

export function createGenericClient<TRead, TCreate, TUpdate>(resourcePath: string) {
  const createParams = (page?: string, pageSize?: string, include?: string): URLSearchParams => {
    const params = new URLSearchParams();
    // TODO: create and use shared constants for query param names across api and ui
    if (page) {
      params.append('page', page);
    }
    if (pageSize) {
      params.append('pageSize', pageSize);
    }
    if (include) {
      params.append('include', include);
    }
    return params;
  };

  return {
    fetchAll: async (page?: string, pageSize?: string, include?: string) => {
      const result = await coreApiRequest<TRead[]>(
        resourcePath,
        '',
        { cache: 'no-store' },
        createParams(page, pageSize, include),
      );
      if (!result.success) throw new Error(result.message);
      return result.data || [];
    },

    fetchById: (id: number, include?: string) =>
      coreApiRequest<TRead>(
        resourcePath,
        `/${id}`,
        { cache: 'no-store' },
        createParams('', '', include),
      ),

    create: (data: TCreate) =>
      coreApiRequest<TRead>(resourcePath, '', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: TUpdate) =>
      coreApiRequest<TRead>(resourcePath, `/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    canDelete: (id: number) => coreApiRequest<boolean>(resourcePath, `/${id}/can-delete`),

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
