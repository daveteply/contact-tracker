import { CompanyDocumentDto } from '@contact-tracker/api-models';
import {
  CompanyRepository,
  DeletionBlockers,
  OperationResult,
  CompanyRxDocument,
} from '@contact-tracker/data-access';

export class CompanyService {
  constructor(private companyRepository: CompanyRepository) {}

  findAll() {
    return this.companyRepository.findAll();
  }

  async search(query: string): Promise<CompanyRxDocument[]> {
    return this.companyRepository.search(query);
  }

  subscribeToCompany(id: string, callback: (doc: CompanyRxDocument | null) => void) {
    return this.companyRepository.subscribeToCompany(id, callback);
  }

  subscribeToAll(callback: (docs: CompanyRxDocument[]) => void) {
    return this.companyRepository.subscribeToAll(callback);
  }

  async create(data: CompanyDocumentDto): Promise<OperationResult> {
    return this.companyRepository.create(data);
  }

  async update(id: string, data: CompanyDocumentDto): Promise<OperationResult> {
    return this.companyRepository.update(id, data);
  }

  async delete(id: string): Promise<OperationResult> {
    return this.companyRepository.delete(id);
  }

  async checkDeletionBlockers(companyId: string): Promise<DeletionBlockers> {
    return this.companyRepository.checkDeletionBlockers(companyId);
  }

  subscribeToDeletionCheck(
    companyId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ) {
    return this.companyRepository.subscribeToDeletionCheck(companyId, callback);
  }
}
