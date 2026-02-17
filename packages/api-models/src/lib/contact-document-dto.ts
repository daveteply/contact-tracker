/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseDocumentDto } from "./base-document-dto";
import { CompanyDocumentDto } from "./company-document-dto";

export interface ContactDocumentDto extends BaseDocumentDto {
    newCompany?: CompanyDocumentDto;
    updateCompany?: CompanyDocumentDto;
    companyId?: string;
    firstName: string;
    lastName: string;
    title?: string;
    email?: string;
    phoneNumber?: string;
    linkedInUrl?: string;
    isPrimaryRecruiter?: boolean;
    notes?: string;
}
