'use client';

import { useEffect, useState } from 'react';
import { useDb } from '../context/db-provider';

export interface DeletionBlockers {
  events: number;
  contacts: number;
  roles: number;
}

export interface DeletionCheck {
  canDelete: boolean;
  blockers: DeletionBlockers;
  loading: boolean;
}

export function useCanDeleteCompany(companyId: string): DeletionCheck {
  const db = useDb();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState<DeletionBlockers>({
    events: 0,
    contacts: 0,
    roles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId || !db) return;

    const companyQuery = db.companies.findOne({
      selector: { id: companyId },
    });

    const companySubscription = companyQuery.$.subscribe(async (company: any) => {
      if (!company) {
        setCanDelete(false);
        setLoading(false);
        return;
      }

      // Count related records
      const eventsCount = await db.events
        .count({
          selector: { companyId: companyId },
        })
        .exec();

      const contactsCount = await db.contacts
        .count({
          selector: { companyId: companyId },
        })
        .exec();

      const rolesCount = await db.roles
        .count({
          selector: { companyId: companyId },
        })
        .exec();

      const newBlockers = {
        events: eventsCount,
        contacts: contactsCount,
        roles: rolesCount,
      };

      setBlockers(newBlockers);
      setCanDelete(eventsCount === 0 && contactsCount === 0 && rolesCount === 0);
      setLoading(false);
    });

    return () => companySubscription.unsubscribe();
  }, [db, companyId]);

  return { canDelete, blockers, loading };
}
