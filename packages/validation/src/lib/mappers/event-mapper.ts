import { EventReadDtoWithRelations } from '@contact-tracker/api-models';
import { EventFormValues } from '../event-schema';

export function mapEventDtoToFormValues(dto: EventReadDtoWithRelations): EventFormValues {
  return {
    ...dto,
    occurredAt: dto.occurredAt ? new Date(dto.occurredAt).toISOString().split('T')[0] : '',
    company: {
      id: dto.company?.id,
      name: dto.company?.name ?? '',
      isNew: false,
    },
    contact: {
      id: dto.contact?.id,
      firstName: dto.contact?.firstName ?? '',
      lastName: dto.contact?.lastName ?? '',
      isNew: false,
    },
    role: {
      id: dto.role?.id,
      title: dto.role?.title ?? '',
      isNew: false,
    },
    source: dto.source,
    direction: dto.direction,
    eventTypeId: dto.eventTypeId,
    summary: dto.summary ?? '',
    details: dto.details ?? '',
  };
}
