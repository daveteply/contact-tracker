import { CompanyDocumentDto } from '@contact-tracker/api-models';
import { DeletionBlockers, OperationResult, TrackerDatabase } from './types/common';
import { CompanyDocument, CompanyRxDocument } from './types/company-types';

export class CompanyRepository {
  constructor(private db: TrackerDatabase) {}

  // Find a single Company by ID
  async findById(id: string): Promise<CompanyRxDocument | null> {
    return this.db.companies
      .findOne({
        selector: { id },
      })
      .exec();
  }

  // Find all Companies sorted by name
  findAll() {
    return this.db.companies.find({
      selector: {},
      sort: [{ name: 'asc' }],
    });
  }

  // Subscribe to a single Company by ID
  subscribeToCompany(id: string, callback: (doc: CompanyRxDocument | null) => void) {
    const query = this.db.companies.findOne({
      selector: { id },
    });

    const subscription = query.$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  // Subscribe to all Companies
  subscribeToAll(callback: (docs: CompanyRxDocument[]) => void) {
    const query = this.findAll();
    const subscription = query.$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  // Create a new Company
  async create(data: CompanyDocumentDto): Promise<OperationResult> {
    try {
      const documentData = dtoToDocument(data);

      await this.db.companies.insert({
        id: crypto.randomUUID(),
        serverId: null,
        ...documentData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Company created locally!' };
    } catch (error) {
      console.error('Local Insert Error:', error);
      return { success: false, message: 'Failed to save to local database' };
    }
  }

  // Update an existing Company
  async update(id: string, data: CompanyDocumentDto): Promise<OperationResult> {
    try {
      const doc = await this.findById(id);

      if (!doc) {
        return { success: false, message: 'Company not found' };
      }

      const documentData = dtoToDocument(data);

      await doc.incrementalPatch({
        ...documentData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Company updated locally!' };
    } catch (error) {
      console.error('Local Update Error:', error);
      return { success: false, message: 'Failed to update in local database' };
    }
  }

  // Delete a Company
  async delete(id: string): Promise<OperationResult> {
    try {
      const doc = await this.findById(id);

      if (!doc) {
        return { success: false, message: 'Company not found' };
      }

      await doc.remove();

      return { success: true, message: 'Company deleted locally!' };
    } catch (error) {
      console.error('Local Delete Error:', error);
      return { success: false, message: 'Failed to delete from local database' };
    }
  }

  // Check if a Company can be deleted (no related records)
  async checkDeletionBlockers(companyId: string): Promise<DeletionBlockers> {
    const [eventsCount, contactsCount, rolesCount] = await Promise.all([
      this.db.events.count({ selector: { companyId } }).exec(),
      this.db.contacts.count({ selector: { companyId } }).exec(),
      this.db.roles.count({ selector: { companyId } }).exec(),
    ]);

    return {
      events: eventsCount,
      contacts: contactsCount,
      roles: rolesCount,
    };
  }

  // Subscribe to deletion check for a Company
  subscribeToDeletionCheck(
    companyId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ) {
    const companyQuery = this.db.companies.findOne({
      selector: { id: companyId },
    });

    const subscription = companyQuery.$.subscribe(async (company: CompanyRxDocument | null) => {
      if (!company) {
        callback({ events: 0, contacts: 0, roles: 0 }, false);
        return;
      }

      const blockers = await this.checkDeletionBlockers(companyId);
      const canDelete = blockers.events === 0 && blockers.contacts === 0 && blockers.roles === 0;

      callback(blockers, canDelete);
    });

    return () => subscription.unsubscribe();
  }
}

// Utility methods
function dtoToDocument(
  data: CompanyDocumentDto,
): Omit<CompanyDocument, 'id' | 'serverId' | 'updatedAt'> {
  return {
    name: data.name,
    website: data.website ?? null,
    industry: data.industry ?? null,
    sizeRange: data.sizeRange ?? null,
    notes: data.notes ?? null,
  };
}
