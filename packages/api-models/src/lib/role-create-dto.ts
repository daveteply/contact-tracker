/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyCreateDto } from "./company-create-dto";
import { RoleLevelTypeDto } from "./role-level-type-dto";

export interface RoleCreateDto {
    companyId?: number;
    newCompany?: CompanyCreateDto;
    title: string;
    jobPostingUrl?: string;
    location?: string;
    level: RoleLevelTypeDto;
}
