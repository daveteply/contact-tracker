/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyUpdateDto } from "./company-update-dto";
import { ContactUpdateDto } from "./contact-update-dto";
import { RoleUpdateDto } from "./role-update-dto";
import { EventTypeUpdateDto } from "./event-type-update-dto";
import { SourceTypeDto } from "./source-type-dto";
import { DirectionTypeDto } from "./direction-type-dto";

export interface EventUpdateDto {
    companyId?: number;
    updateCompany?: CompanyUpdateDto;
    contactId?: number;
    updateContact?: ContactUpdateDto;
    roleId?: number;
    updateRole?: RoleUpdateDto;
    eventTypeId?: number;
    updateEventType?: EventTypeUpdateDto;
    occurredAt?: Date;
    summary?: string;
    details?: string;
    source?: SourceTypeDto;
    direction?: DirectionTypeDto;
}
