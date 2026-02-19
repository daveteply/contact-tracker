import { ContactDocumentDto } from '@contact-tracker/api-models';
import { BaseRxDocument } from './common';
import { RxCollection, RxDocument } from 'rxdb';

// Contact document as stored in RxDB (based on schema)
export interface ContactDocument extends BaseRxDocument {
  firstName: string;
  lastName: string;
  companyId: string;
  title: string | null;
  email: string | null;
  phoneNumber: string | null;
  linkedInUrl: string | null;
  isPrimaryContact?: boolean;
  notes: string | null;
}

// RxDB typed document
export type ContactRxDocument = RxDocument<ContactDocument>;

// Collection types
export type ContactCollection = RxCollection<ContactDocument>;

// Helper to convert RxDocument to DTO
export function toContactDto(doc: ContactRxDocument): ContactDocumentDto {
  return doc.toJSON() as unknown as ContactDocumentDto;
}
