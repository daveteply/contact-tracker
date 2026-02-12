/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyCreateDto } from "./company-create-dto";
import { ContactCreateDto } from "./contact-create-dto";
import { RoleCreateDto } from "./role-create-dto";
import { EventTypeCreateDto } from "./event-type-create-dto";
import { SourceTypeDto } from "./source-type-dto";
import { DirectionTypeDto } from "./direction-type-dto";

export interface EventCreateDto {
    companyId?: number;
    newCompany?: CompanyCreateDto;
    contactId?: number;
    newContact?: ContactCreateDto;
    roleId?: number;
    newRole?: RoleCreateDto;
    eventTypeId: number;
    newEventType: EventTypeCreateDto;
    occurredAt: Date;
    summary?: string;
    details?: string;
    source: SourceTypeDto;
    direction: DirectionTypeDto;
}
