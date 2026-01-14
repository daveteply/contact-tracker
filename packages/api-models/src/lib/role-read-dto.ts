/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { RoleLevel } from './role-level';

export interface RoleReadDto {
  id: number;
  companyId?: number;
  title: string;
  jobPostingUrl?: string;
  location?: string;
  level: RoleLevel;
}
