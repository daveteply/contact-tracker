/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { CompanyReadDto } from "./company-read-dto";
import { ContactReadDto } from "./contact-read-dto";
import { RoleReadDto } from "./role-read-dto";
import { EventTypeReadDto } from "./event-type-read-dto";
import { SourceType } from "./source-type";
import { DirectionType } from "./direction-type";

export interface EventReadDto {
    id: number;
    companyId?: number;
    company?: CompanyReadDto;
    contactId?: number;
    contact?: ContactReadDto;
    roleId?: number;
    role?: RoleReadDto;
    eventTypeId: number;
    eventType?: EventTypeReadDto;
    occurredAt: Date;
    summary?: string;
    details?: string;
    source: SourceType;
    direction: DirectionType;
}
