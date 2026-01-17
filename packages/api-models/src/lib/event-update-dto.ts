/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyUpdateDto } from "./company-update-dto";
import { ContactUpdateDto } from "./contact-update-dto";
import { RoleUpdateDto } from "./role-update-dto";
import { SourceType } from "./source-type";
import { DirectionType } from "./direction-type";

export interface EventUpdateDto {
    companyId?: number;
    updateCompany?: CompanyUpdateDto;
    contactId?: number;
    updateContact?: ContactUpdateDto;
    roleId?: number;
    updateRole?: RoleUpdateDto;
    eventTypeId?: number;
    occurredAt?: Date;
    summary?: string;
    details?: string;
    source?: SourceType;
    direction?: DirectionType;
}
