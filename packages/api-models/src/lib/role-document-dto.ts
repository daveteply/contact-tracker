/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseDocumentDto } from "./base-document-dto";
import { CompanyDocumentDto } from "./company-document-dto";
import { RoleLevelTypeDto } from "./role-level-type-dto";

export interface RoleDocumentDto extends BaseDocumentDto {
    newCompany?: CompanyDocumentDto;
    updateCompany?: CompanyDocumentDto;
    companyId?: string;
    title: string;
    jobPostingUrl?: string;
    location?: string;
    level: RoleLevelTypeDto;
}
