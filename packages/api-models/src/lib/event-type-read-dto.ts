/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { EventTypeCategoryTypeDto } from "./event-type-category-type-dto";

export interface EventTypeReadDto {
    id: number;
    name: string;
    category: EventTypeCategoryTypeDto;
    isSystemDefined: boolean;
}
