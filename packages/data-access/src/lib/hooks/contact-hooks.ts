'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContactRepository } from '../repositories/contact-repository';
import { useDb } from '../db';
import { toContactDto } from '../repositories/types/contact-types';
import { ContactDocumentDto } from '@contact-tracker/api-models';
import { DeletionCheck } from '../repositories/types/common';

// Hook to get the Contact repository instance
export function useContactRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new ContactRepository(db);
  }, [db]);
}

// Hook to fetch all Contacts with real-time updates
export function useContacts() {
  const repository = useContactRepository();
  const [contacts, setContacts] = useState<ContactDocumentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repository) return;

    const unsubscribe = repository.subscribeToAll((docs) => {
      const mapped = docs.map(toContactDto);
      setContacts(mapped);
      setLoading(false);
    });

    return unsubscribe;
  }, [repository]);

  return { contacts, loading };
}

export function useContactSearch() {
  const repository = useContactRepository();

  // We use useCallback so the function reference stays stable
  const search = useCallback(
    async (firstName: string, lastName: string) => {
      if (!repository) return [];

      // Fetch from RxDB
      const docs = await repository.search(firstName, lastName);

      // MUST RETURN the mapped results to satisfy the Promise<ContactDocumentDto[]> type
      return docs.map(toContactDto);
    },
    [repository],
  );

  return { search };
}

// Hook to fetch a single Contact by ID with real-time updates
export function useContact(id: string) {
  const repository = useContactRepository();
  const [contact, setContact] = useState<ContactDocumentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !repository) return;

    const unsubscribe = repository.subscribeToContact(id, (doc) => {
      if (doc) {
        setContact(toContactDto(doc));
        setError(null);
      } else {
        setContact(null);
        setError('Contact not found');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [repository, id]);

  return { contact, loading, error };
}

// Hook to check if a Contact can be deleted (checks for related records)
export function useCanDeleteContact(contactId: string): DeletionCheck {
  const repository = useContactRepository();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState({
    events: 0,
    contacts: 0,
    roles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId || !repository) return;

    const unsubscribe = repository.subscribeToDeletionCheck(
      contactId,
      (newBlockers, canDeleteValue) => {
        setBlockers(newBlockers);
        setCanDelete(canDeleteValue);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [repository, contactId]);

  return { canDelete, blockers, loading };
}

// Hook to get Contact mutation functions
// Returns functions for create, update, and delete operations
export function useContactMutations() {
  const repository = useContactRepository();

  const create = async (data: ContactDocumentDto) => {
    if (!repository) {
      return { success: false, message: 'Database not initialized' };
    }
    return repository.create(data);
  };

  const update = async (id: string, data: ContactDocumentDto) => {
    if (!repository) {
      return { success: false, message: 'Database not initialized' };
    }
    return repository.update(id, data);
  };

  const deleteContact = async (id: string) => {
    if (!repository) {
      return { success: false, message: 'Database not initialized' };
    }
    return repository.delete(id);
  };

  return {
    create,
    update,
    delete: deleteContact,
  };
}
