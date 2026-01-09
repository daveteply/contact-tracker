/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IAuditableEntity } from "./i-auditable-entity";
import { Company } from "./company";
import { Event } from "./event";

export interface Contact extends IAuditableEntity {
    companyId?: number;
    company?: Company;
    firstName: string;
    lastName: string;
    title?: string;
    email?: string;
    phoneNumber?: string;
    linkedInUrl?: string;
    isPrimaryRecruiter?: boolean;
    notes?: string;
    events: Event[];
}
