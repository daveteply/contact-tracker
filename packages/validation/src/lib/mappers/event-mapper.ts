import { EventReadDto } from '@contact-tracker/api-models';
import { EventFormValues } from '../event-schema';

export function mapEventDtoToFormValues(dto: EventReadDto): EventFormValues {
  return {
    ...dto,
    occurredAt: dto.occurredAt ? new Date(dto.occurredAt).toISOString().split('T')[0] : '',
    company: {
      id: dto.company?.id,
      name: dto.company?.name ?? '',
      isNew: false, // Explicitly tell the form this is an existing entity
    },
    contact: {
      id: dto.contact?.id,
      firstName: dto.contact?.firstName ?? '',
      lastName: dto.contact?.lastName ?? '',
      isNew: false, // Explicitly tell the form this is an existing entity
    },
    role: {
      id: dto.role?.id,
      title: dto.role?.title ?? '',
      isNew: false, // Explicitly tell the form this is an existing entity
    },
    source: dto.source,
    direction: dto.direction,
    eventTypeId: dto.eventTypeId,
    summary: dto.summary ?? '',
    details: dto.details ?? '',
  };
}
