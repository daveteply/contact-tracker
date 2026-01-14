/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { SourceType } from './source-type';
import { DirectionType } from './direction-type';

export interface EventCreateDto {
  companyId?: number;
  contactId?: number;
  roleId?: number;
  eventTypeId: number;
  occurredAt: Date;
  summary?: string;
  details?: string;
  source: SourceType;
  direction: DirectionType;
}
