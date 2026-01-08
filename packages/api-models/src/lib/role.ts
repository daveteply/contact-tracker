/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IAuditableEntity } from './i-auditable-entity';
import { Company } from './company';
import { RoleLevel } from './role-level';
import { Event } from './event';

export interface Role extends IAuditableEntity {
  companyId?: number;
  company?: Company;
  title: string;
  jobPostingUrl?: string;
  location?: string;
  level: RoleLevel;
  events: Event[];
}
