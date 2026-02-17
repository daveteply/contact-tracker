'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDb } from '../db';
import { CompanyRepository } from '../repositories/company-repository';
import { toCompanyDto } from '../repositories/types/company-types';
import { CompanyDocumentDto } from '@contact-tracker/api-models';
import { DeletionCheck } from '../repositories/types/common';

// Hook to get the Company repository instance
export function useCompanyRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);
}

// Hook to fetch all Companies with real-time updates
export function useCompanies() {
  const repository = useCompanyRepository();
  const [companies, setCompanies] = useState<CompanyDocumentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repository) return;

    const unsubscribe = repository.subscribeToAll((docs) => {
      const mapped = docs.map(toCompanyDto);
      setCompanies(mapped);
      setLoading(false);
    });

    return unsubscribe;
  }, [repository]);

  return { companies, loading };
}

export function useCompanySearch() {
  const repository = useCompanyRepository();

  // We use useCallback so the function reference stays stable
  const search = useCallback(
    async (query: string) => {
      if (!repository) return [];

      // Fetch from RxDB
      const docs = await repository.search(query);

      // MUST RETURN the mapped results to satisfy the Promise<CompanyDocumentDto[]> type
      return docs.map(toCompanyDto);
    },
    [repository],
  );

  return { search };
}

// Hook to fetch a single Company by ID with real-time updates
export function useCompany(id: string) {
  const repository = useCompanyRepository();
  const [company, setCompany] = useState<CompanyDocumentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !repository) return;

    const unsubscribe = repository.subscribeToCompany(id, (doc) => {
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
  }, [repository, id]);

  return { company, loading, error };
}

// Hook to check if a Company can be deleted (checks for related records)
export function useCanDeleteCompany(companyId: string): DeletionCheck {
  const repository = useCompanyRepository();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState({
    events: 0,
    contacts: 0,
    roles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId || !repository) return;

    const unsubscribe = repository.subscribeToDeletionCheck(
      companyId,
      (newBlockers, canDeleteValue) => {
        setBlockers(newBlockers);
        setCanDelete(canDeleteValue);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [repository, companyId]);

  return { canDelete, blockers, loading };
}

// Hook to get Company mutation functions
// Returns functions for create, update, and delete operations
export function useCompanyMutations() {
  const repository = useCompanyRepository();

  const create = async (data: CompanyDocumentDto) => {
    if (!repository) {
      return { success: false, message: 'Database not initialized' };
    }
    return repository.create(data);
  };

  const update = async (id: string, data: CompanyDocumentDto) => {
    if (!repository) {
      return { success: false, message: 'Database not initialized' };
    }
    return repository.update(id, data);
  };

  const deleteCompany = async (id: string) => {
    if (!repository) {
      return { success: false, message: 'Database not initialized' };
    }
    return repository.delete(id);
  };

  return {
    create,
    update,
    delete: deleteCompany,
  };
}
