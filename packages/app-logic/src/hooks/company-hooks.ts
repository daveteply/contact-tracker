'use client';

import { useCallback, useEffect, useState } from 'react';
import { CompanyDocumentDto } from '@contact-tracker/api-models';
import { toCompanyDto, DeletionCheck } from '@contact-tracker/data-access';
import { useServices } from '../context/service-context';

// Hook to get the Company service instance
export function useCompanyService() {
  const { companyService } = useServices();
  return companyService;
}

// Hook to fetch all Companies with real-time updates
export function useCompanies() {
  const service = useCompanyService();
  const [companies, setCompanies] = useState<CompanyDocumentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!service) return;

    const unsubscribe = service.subscribeToAll((docs) => {
      const mapped = docs.map(toCompanyDto);
      setCompanies(mapped);
      setLoading(false);
    });

    return unsubscribe;
  }, [service]);

  return { companies, loading };
}

export function useCompanySearch() {
  const service = useCompanyService();

  // We use useCallback so the function reference stays stable
  const search = useCallback(
    async (query: string) => {
      if (!service) return [];

      // Fetch from RxDB
      const docs = await service.search(query);

      // MUST RETURN the mapped results to satisfy the Promise<CompanyDocumentDto[]> type
      return docs.map(toCompanyDto);
    },
    [service],
  );

  return { search };
}

// Hook to fetch a single Company by ID with real-time updates
export function useCompany(id: string) {
  const service = useCompanyService();
  const [company, setCompany] = useState<CompanyDocumentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !service) return;

    const unsubscribe = service.subscribeToCompany(id, (doc) => {
      if (doc) {
        setCompany(toCompanyDto(doc));
        setError(null);
      } else {
        setCompany(null);
        setError('Company not found');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [service, id]);

  return { company, loading, error };
}

// Hook to check if a Company can be deleted (checks for related records)
export function useCanDeleteCompany(companyId: string): DeletionCheck {
  const service = useCompanyService();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState({
    events: 0,
    contacts: 0,
    roles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId || !service) return;

    const unsubscribe = service.subscribeToDeletionCheck(
      companyId,
      (newBlockers, canDeleteValue) => {
        setBlockers(newBlockers);
        setCanDelete(canDeleteValue);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [service, companyId]);

  return { canDelete, blockers, loading };
}

// Hook to get Company mutation functions
// Returns functions for create, update, and delete operations
export function useCompanyMutations() {
  const service = useCompanyService();

  const create = async (data: CompanyDocumentDto) => {
    if (!service) {
      return { success: false, message: 'Database not initialized' };
    }
    return service.create(data);
  };

  const update = async (id: string, data: CompanyDocumentDto) => {
    if (!service) {
      return { success: false, message: 'Database not initialized' };
    }
    return service.update(id, data);
  };

  const deleteCompany = async (id: string) => {
    if (!service) {
      return { success: false, message: 'Database not initialized' };
    }
    return service.delete(id);
  };

  return {
    create,
    update,
    delete: deleteCompany,
  };
}
