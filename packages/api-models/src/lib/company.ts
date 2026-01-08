/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IAuditableEntity } from './i-auditable-entity';
import { Event } from './event';
import { Contact } from './contact';
import { Role } from './role';

export interface Company extends IAuditableEntity {
  name: string;
  website?: string;
  industry?: string;
  sizeRange?: string;
  notes?: string;
  events: Event[];
  contacts: Contact[];
  roles: Role[];
}
