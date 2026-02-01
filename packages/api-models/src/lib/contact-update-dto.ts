/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyUpdateDto } from "./company-update-dto";

export interface ContactUpdateDto {
    companyId?: number;
    updateCompany?: CompanyUpdateDto;
    firstName?: string;
    lastName?: string;
    title?: string;
    email?: string;
    phoneNumber?: string;
    linkedInUrl?: string;
    isPrimaryRecruiter?: boolean;
    notes?: string;
}
