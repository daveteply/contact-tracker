import { RoleDocumentDto, RoleLevelTypeDto } from '@contact-tracker/api-models';
import { DeletionBlockers, OperationResult, TrackerDatabase } from './types/common';
import { RoleDocument, RoleRxDocument } from './types/role-types';

export class RoleRepository {
  constructor(private db: TrackerDatabase) {}

  // Find a single Role by ID
  async findById(id: string): Promise<RoleRxDocument | null> {
    return this.db.roles
      .findOne({
        selector: { id },
      })
      .exec();
  }

  // Find all Roles sorted by name
  findAll() {
    return this.db.roles.find({
      selector: {},
      sort: [{ name: 'asc' }],
    });
  }

  // Search Roles by name
  async search(query: string): Promise<RoleRxDocument[]> {
    // If query is empty, you might want to return nothing or the first few Roles
    if (!query.trim()) {
      return [];
    }

    return this.db.roles
      .find({
        selector: {
          name: {
            $regex: query,
            $options: 'i',
          },
        },
        sort: [{ name: 'asc' }],
        limit: 10,
      })
      .exec();
  }

  // Subscribe to a single Role by ID
  subscribeToRole(id: string, callback: (doc: RoleRxDocument | null) => void) {
    const query = this.db.roles.findOne({
      selector: { id },
    });

    const subscription = query.$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  // Subscribe to all Roles
  subscribeToAll(callback: (docs: RoleRxDocument[]) => void) {
    const query = this.findAll();
    const subscription = query.$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  // Create a new Role
  async create(data: RoleDocumentDto): Promise<OperationResult> {
    try {
      const documentData = dtoToDocument(data);

      await this.db.roles.insert({
        id: crypto.randomUUID(),
        serverId: null,
        ...documentData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Role created locally!' };
    } catch (error) {
      console.error('Local Insert Error:', error);
      return { success: false, message: 'Failed to save to local database' };
    }
  }

  // Update an existing Role
  async update(id: string, data: RoleDocumentDto): Promise<OperationResult> {
    try {
      const doc = await this.findById(id);

      if (!doc) {
        return { success: false, message: 'Role not found' };
      }

      const documentData = dtoToDocument(data);

      await doc.incrementalPatch({
        ...documentData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Role updated locally!' };
    } catch (error) {
      console.error('Local Update Error:', error);
      return { success: false, message: 'Failed to update in local database' };
    }
  }

  // Delete a Role
  async delete(id: string): Promise<OperationResult> {
    try {
      const doc = await this.findById(id);

      if (!doc) {
        return { success: false, message: 'Role not found' };
      }

      await doc.remove();

      return { success: true, message: 'Role deleted locally!' };
    } catch (error) {
      console.error('Local Delete Error:', error);
      return { success: false, message: 'Failed to delete from local database' };
    }
  }

  // Check if a Role can be deleted (no related records)
  async checkDeletionBlockers(roleId: string): Promise<DeletionBlockers> {
    const [eventsCount, contactsCount, rolesCount] = await Promise.all([
      this.db.events.count({ selector: { roleId } }).exec(),
      this.db.contacts.count({ selector: { roleId } }).exec(),
      this.db.roles.count({ selector: { roleId } }).exec(),
    ]);

    return {
      events: eventsCount,
      contacts: contactsCount,
      roles: rolesCount,
    };
  }

  // Subscribe to deletion check for a Role
  subscribeToDeletionCheck(
    roleId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ) {
    const RoleQuery = this.db.roles.findOne({
      selector: { id: roleId },
    });

    const subscription = RoleQuery.$.subscribe(async (role: RoleRxDocument | null) => {
      if (!role) {
        callback({ events: 0, contacts: 0, roles: 0 }, false);
        return;
      }

      const blockers = await this.checkDeletionBlockers(roleId);
      const canDelete = blockers.events === 0 && blockers.contacts === 0 && blockers.roles === 0;

      callback(blockers, canDelete);
    });

    return () => subscription.unsubscribe();
  }
}

// Utility methods
function dtoToDocument(data: RoleDocumentDto): Omit<RoleDocument, 'id' | 'serverId' | 'updatedAt'> {
  return {
    title: data.title,
    jobPostingUrl: data.jobPostingUrl ?? null,
    location: data.location ?? null,
    level: RoleLevelTypeDto,
  };
}
