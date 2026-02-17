import { RxCollection, RxDocument } from 'rxdb';
import { BaseRxDocument } from './common';
import { RoleDocumentDto, RoleLevelTypeDto } from '@contact-tracker/api-models';

// Role document as stored in RxDB (based on schema)
export interface RoleDocument extends BaseRxDocument {
  title: string;
  jobPostingUrl: string | null;
  location: string | null;
  level: RoleLevelTypeDto;
}

// RxDB typed document
export type RoleRxDocument = RxDocument<RoleDocument>;

// Collection types
export type RoleCollection = RxCollection<RoleDocument>;

// Helper to convert RxDocument to DTO
export function toRoleDto(doc: RoleRxDocument): RoleDocumentDto {
  return doc.toJSON() as unknown as RoleDocumentDto;
}
