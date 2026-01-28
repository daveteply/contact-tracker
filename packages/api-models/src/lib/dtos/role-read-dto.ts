/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyReadDto } from "./company-read-dto";
import { RoleLevel } from "./role-level";

export interface RoleReadDto {
    id: number;
    companyId?: number;
    company?: CompanyReadDto;
    title: string;
    jobPostingUrl?: string;
    location?: string;
    level: RoleLevel;
}
