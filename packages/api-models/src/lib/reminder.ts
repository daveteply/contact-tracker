/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IAuditableEntity } from "./i-auditable-entity";
import { Event } from "./event";

export interface Reminder extends IAuditableEntity {
    eventId: number;
    event: Event;
    remindAt: Date;
    completedAt?: Date;
}
