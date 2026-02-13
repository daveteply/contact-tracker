'use client';

import { useEffect, useState } from 'react';
import { useDb } from '../context/db-provider';
import { CompanyReadDto } from '@contact-tracker/api-models';

export function useCompanies() {
  const db = useDb();
  const [companies, setCompanies] = useState<CompanyReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a query that finds all companies sorted by name
    const query = db.companies.find({
      selector: {},
      sort: [{ name: 'asc' }],
    });

    // Subscribe to the query ($ is an RxJS observable)
    const subscription = query.$.subscribe((results: any) => {
      // We map the RxDB documents to our DTO shape for the UI
      const mapped = results.map((doc: any) => doc.toJSON());
      setCompanies(mapped);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [db]);

  return { companies, loading };
}
