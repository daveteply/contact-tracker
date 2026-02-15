import { CompanyDocumentDto } from '@contact-tracker/api-models';
import { RxCollection, RxDocument } from 'rxdb';
import { BaseRxDocument } from './common';

// Company document as stored in RxDB (based on schema)
export interface CompanyDocument extends BaseRxDocument {
  name: string;
  website: string | null;
  industry: string | null;
  sizeRange: string | null;
  notes: string | null;
}

// RxDB typed document
export type CompanyRxDocument = RxDocument<CompanyDocument>;

// Collection types
export type CompanyCollection = RxCollection<CompanyDocument>;

// Helper to convert RxDocument to DTO
export function toCompanyDto(doc: CompanyRxDocument): CompanyDocumentDto {
  return doc.toJSON() as unknown as CompanyDocumentDto;
}
