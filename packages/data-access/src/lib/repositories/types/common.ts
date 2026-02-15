import { RxCollection, RxDatabase } from 'rxdb';
import { CompanyCollection } from './company-types';

// Base document type that includes RxDB metadata
export interface BaseRxDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
}

export interface TrackerCollections {
  companies: CompanyCollection;
  contacts: RxCollection; // TODO: Type these similarly
  events: RxCollection;
  eventTypes: RxCollection;
  roles: RxCollection;
  reminder: RxCollection;
}

export type TrackerDatabase = RxDatabase<TrackerCollections>;

// Operation result types
export interface OperationResult {
  success: boolean;
  message: string;
}

// Deletion check types
export interface DeletionBlockers {
  events: number;
  contacts: number;
  roles: number;
}

export interface DeletionCheck {
  canDelete: boolean;
  blockers: DeletionBlockers;
  loading: boolean;
}
