/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseDocumentDto } from "./base-document-dto";

export interface ReminderDocumentDto extends BaseDocumentDto {
    eventId?: string;
    remindAt: Date;
    completedAt?: Date;
}
