/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseDocumentDto } from "./base-document-dto";
import { EventTypeCategoryTypeDto } from "./event-type-category-type-dto";

export interface EventTypeDocumentDto extends BaseDocumentDto {
    name: string;
    category: EventTypeCategoryTypeDto;
    isSystemDefined: boolean;
}
