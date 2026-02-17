import { ContactDocumentDto } from '@contact-tracker/api-models';
import { DeletionBlockers, OperationResult, TrackerDatabase } from './types/common';
import { ContactDocument, ContactRxDocument } from './types/contact-types';

export class ContactRepository {
  constructor(private db: TrackerDatabase) {}

  // Find a single Contact by ID
  async findById(id: string): Promise<ContactRxDocument | null> {
    return this.db.contacts
      .findOne({
        selector: { id },
      })
      .exec();
  }

  // Find all Contacts sorted by last name
  findAll() {
    return this.db.contacts.find({
      selector: {},
      sort: [{ lastName: 'asc' }],
    });
  }

  // Subscribe to a single Contact by ID
  subscribeToContact(id: string, callback: (doc: ContactRxDocument | null) => void) {
    const query = this.db.contacts.findOne({
      selector: { id },
    });

    const subscription = query.$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  // Subscribe to all Contacts
  subscribeToAll(callback: (docs: ContactRxDocument[]) => void) {
    const query = this.findAll();
    const subscription = query.$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  // Create a new Contact
  async create(data: ContactDocumentDto): Promise<OperationResult> {
    try {
      const documentData = dtoToDocument(data);

      await this.db.contacts.insert({
        id: crypto.randomUUID(),
        serverId: null,
        ...documentData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Contact created locally!' };
    } catch (error) {
      console.error('Local Insert Error:', error);
      return { success: false, message: 'Failed to save to local database' };
    }
  }

  // Update an existing Contact
  async update(id: string, data: ContactDocumentDto): Promise<OperationResult> {
    try {
      const doc = await this.findById(id);

      if (!doc) {
        return { success: false, message: 'Contact not found' };
      }

      const documentData = dtoToDocument(data);

      await doc.incrementalPatch({
        ...documentData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Contact updated locally!' };
    } catch (error) {
      console.error('Local Update Error:', error);
      return { success: false, message: 'Failed to update in local database' };
    }
  }

  // Delete a Contact
  async delete(id: string): Promise<OperationResult> {
    try {
      const doc = await this.findById(id);

      if (!doc) {
        return { success: false, message: 'Contact not found' };
      }

      await doc.remove();

      return { success: true, message: 'Contact deleted locally!' };
    } catch (error) {
      console.error('Local Delete Error:', error);
      return { success: false, message: 'Failed to delete from local database' };
    }
  }

  // Check if a Contact can be deleted (no related records)
  async checkDeletionBlockers(contactId: string): Promise<DeletionBlockers> {
    const [eventsCount] = await Promise.all([
      this.db.events.count({ selector: { contactId } }).exec(),
    ]);

    return {
      events: eventsCount,
      contacts: 0,
      roles: 0,
    };
  }

  // Subscribe to deletion check for a Contact
  subscribeToDeletionCheck(
    contactId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ) {
    const contactQuery = this.db.contacts.findOne({
      selector: { id: contactId },
    });

    const subscription = contactQuery.$.subscribe(async (contact: ContactRxDocument | null) => {
      if (!contact) {
        callback({ events: 0, contacts: 0, roles: 0 }, false);
        return;
      }

      const blockers = await this.checkDeletionBlockers(contactId);
      const canDelete = blockers.events === 0 && blockers.contacts === 0 && blockers.roles === 0;

      callback(blockers, canDelete);
    });

    return () => subscription.unsubscribe();
  }
}

// Utility methods
function dtoToDocument(
  data: ContactDocumentDto,
): Omit<ContactDocument, 'id' | 'serverId' | 'updatedAt'> {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    title: data.title ?? null,
    email: data.email ?? null,
    phoneNumber: data.phoneNumber ?? null,
    linkedInUrl: data.linkedInUrl ?? null,
    isPrimaryContact: data.isPrimaryRecruiter,
    notes: data.notes ?? null,
  };
}
