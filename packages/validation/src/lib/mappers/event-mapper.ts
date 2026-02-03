// packages/validation/src/lib/mappers/event-mapper.ts
import { EventReadDto } from '@contact-tracker/api-models';
import { EventFormValues } from '../event-schema';

export function mapEventDtoToFormValues(dto: EventReadDto): EventFormValues {
  return {
    // 1. Core Fields
    eventTypeId: dto.eventTypeId,
    source: dto.source,
    direction: dto.direction,
    summary: dto.summary ?? '',
    details: dto.details ?? '',

    // 2. Date Formatting for HTML5 input type="date"
    // The input expects 'YYYY-MM-DD', but the DTO usually has an ISO string
    occurredAt: dto.occurredAt
      ? new Date(dto.occurredAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],

    // 3. Child Entity Normalization
    // Passing null if they don't exist prevents SelectionSchema refinements from firing
    company: dto.company
      ? {
          id: dto.company.id,
          name: dto.company.name,
          isNew: false,
          displayValue: dto.company.name,
        }
      : null,

    contact: dto.contact
      ? {
          id: dto.contact.id,
          firstName: dto.contact.firstName,
          lastName: dto.contact.lastName,
          isNew: false,
          displayValue: `${dto.contact.firstName} ${dto.contact.lastName}`,
        }
      : null,

    role: dto.role
      ? {
          id: dto.role.id,
          title: dto.role.title,
          isNew: false,
          displayValue: dto.role.title,
        }
      : null,
  };
}
