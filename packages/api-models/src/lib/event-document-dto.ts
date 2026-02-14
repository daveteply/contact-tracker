/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseDocumentDto } from "./base-document-dto";
import { DirectionTypeDto } from "./direction-type-dto";

export interface EventDocumentDto extends BaseDocumentDto {
    companyId?: string;
    contactId?: string;
    roleId?: string;
    eventTypeId?: string;
    occurredAt: Date;
    summary?: string;
    details?: string;
    direction: DirectionTypeDto;
}
