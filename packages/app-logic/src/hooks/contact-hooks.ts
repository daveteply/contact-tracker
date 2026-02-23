'use client';

import { useCallback, useEffect, useState } from 'react';
import { ContactDocumentDto } from '@contact-tracker/api-models';
import { toContactDto, DeletionCheck } from '@contact-tracker/data-access';
import { useServices } from '../context/service-context';

// Hook to get the Contact service instance
export function useContactService() {
  const { contactService } = useServices();
  return contactService;
}

// Hook to fetch all Contacts with real-time updates
export function useContacts() {
  const service = useContactService();
  const [contacts, setContacts] = useState<ContactDocumentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!service) return;

    const unsubscribe = service.subscribeToAll((docs) => {
      const mapped = docs.map(toContactDto);
      setContacts(mapped);
      setLoading(false);
    });

    return unsubscribe;
  }, [service]);

  return { contacts, loading };
}

export function useContactSearch() {
  const service = useContactService();

  // We use useCallback so the function reference stays stable
  const search = useCallback(
    async (firstName: string, lastName: string) => {
      if (!service) return [];

      // Fetch from RxDB
      const docs = await service.search(firstName, lastName);

      // MUST RETURN the mapped results to satisfy the Promise<ContactDocumentDto[]> type
      return docs.map(toContactDto);
    },
    [service],
  );

  return { search };
}

// Hook to fetch a single Contact by ID with real-time updates
export function useContact(id: string) {
  const service = useContactService();
  const [contact, setContact] = useState<ContactDocumentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !service) return;

    const unsubscribe = service.subscribeToContact(id, (doc) => {
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
  }, [service, id]);

  return { contact, loading, error };
}

// Hook to check if a Contact can be deleted (checks for related records)
export function useCanDeleteContact(contactId: string): DeletionCheck {
  const service = useContactService();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState({
    events: 0,
    contacts: 0,
    roles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId || !service) return;

    const unsubscribe = service.subscribeToDeletionCheck(
      contactId,
      (newBlockers, canDeleteValue) => {
        setBlockers(newBlockers);
        setCanDelete(canDeleteValue);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [service, contactId]);

  return { canDelete, blockers, loading };
}

// Hook to get Contact mutation functions
// Returns functions for create, update, and delete operations
export function useContactMutations() {
  const service = useContactService();

  const create = async (data: ContactDocumentDto) => {
    if (!service) {
      return { success: false, message: 'Database not initialized' };
    }
    return service.create(data);
  };

  const update = async (id: string, data: ContactDocumentDto) => {
    if (!service) {
      return { success: false, message: 'Database not initialized' };
    }
    return service.update(id, data);
  };

  const deleteContact = async (id: string) => {
    if (!service) {
      return { success: false, message: 'Database not initialized' };
    }
    return service.delete(id);
  };

  return {
    create,
    update,
    delete: deleteContact,
  };
}
