/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyCreateDto } from "./company-create-dto";

export interface ContactCreateDto {
    companyId?: number;
    newCompany?: CompanyCreateDto;
    firstName: string;
    lastName: string;
    title?: string;
    email?: string;
    phoneNumber?: string;
    linkedInUrl?: string;
    isPrimaryRecruiter?: boolean;
    notes?: string;
}
