'use client';

import { useEffect, useState } from 'react';
import { useDb } from '../context/db-provider';
import { CompanyReadDto } from '@contact-tracker/api-models';

export function useCompany(id: string) {
  const db = useDb();
  const [company, setCompany] = useState<CompanyReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !db) return;

    const query = db.companies.findOne({
      selector: { id: id },
    });

    const subscription = query.$.subscribe((doc: any) => {
      if (doc) {
        setCompany(doc.toJSON());
        setError(null);
      } else {
        setCompany(null);
        setError('Company not found');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [db, id]);

  return { company, loading, error };
}
