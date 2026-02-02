/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyUpdateDto } from "./company-update-dto";
import { RoleLevel } from "./role-level";

export interface RoleUpdateDto {
    companyId?: number;
    updateCompany?: CompanyUpdateDto;
    title?: string;
    jobPostingUrl?: string;
    location?: string;
    level?: RoleLevel;
}
