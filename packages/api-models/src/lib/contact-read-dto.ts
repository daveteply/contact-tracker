/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyReadDto } from "./company-read-dto";

export interface ContactReadDto {
    id: number;
    companyId?: number;
    company?: CompanyReadDto;
    firstName: string;
    lastName: string;
    title?: string;
    email?: string;
    phoneNumber?: string;
    linkedInUrl?: string;
    isPrimaryRecruiter?: boolean;
    notes?: string;
}
