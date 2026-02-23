import { ContactDocumentDto } from '@contact-tracker/api-models';
import {
  ContactRepository,
  DeletionBlockers,
  OperationResult,
  ContactRxDocument,
} from '@contact-tracker/data-access';

export class ContactService {
  constructor(private repository: ContactRepository) {}

  findAll() {
    return this.repository.findAll();
  }

  async search(firstName: string, lastName: string): Promise<ContactRxDocument[]> {
    return this.repository.search(firstName, lastName);
  }

  subscribeToContact(id: string, callback: (doc: ContactRxDocument | null) => void) {
    return this.repository.subscribeToContact(id, callback);
  }

  subscribeToAll(callback: (docs: ContactRxDocument[]) => void) {
    return this.repository.subscribeToAll(callback);
  }

  async create(data: ContactDocumentDto): Promise<OperationResult> {
    return this.repository.create(data);
  }

  async update(id: string, data: ContactDocumentDto): Promise<OperationResult> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<OperationResult> {
    return this.repository.delete(id);
  }

  async checkDeletionBlockers(contactId: string): Promise<DeletionBlockers> {
    return this.repository.checkDeletionBlockers(contactId);
  }

  subscribeToDeletionCheck(
    contactId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ) {
    return this.repository.subscribeToDeletionCheck(contactId, callback);
  }
}
