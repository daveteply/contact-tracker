/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IAuditableEntity } from './i-auditable-entity';
import { Company } from './company';
import { Contact } from './contact';
import { Role } from './role';
import { EventType } from './event-type';
import { SourceType } from './source-type';
import { DirectionType } from './direction-type';
import { Reminder } from './reminder';

export interface Event extends IAuditableEntity {
  companyId?: number;
  company?: Company;
  contactId?: number;
  contact?: Contact;
  roleId?: number;
  role?: Role;
  eventTypeId: number;
  eventType?: EventType;
  occurredAt: Date;
  summary?: string;
  details?: string;
  source: SourceType;
  direction: DirectionType;
  reminders: Reminder[];
}
