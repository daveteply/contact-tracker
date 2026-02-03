'use server';

import {
  EventCreate,
  EventCreateSchema,
  EventUpdate,
  EventUpdateSchema,
} from '@contact-tracker/validation';
import { createEvent, deleteEvent, updateEvent } from '../clients/events-client';
import { revalidatePath } from 'next/cache';
import {
  ApiResult,
  EventCreateDto,
  EventReadDto,
  EventUpdateDto,
  RoleLevel,
} from '@contact-tracker/api-models';

const EVENTS_PATH = '/events';

async function handleActionResult(
  request: Promise<ApiResult<EventReadDto>>,
  successMessage: string,
) {
  try {
    const result = await request;

    if (!result.success) {
      return {
        success: false,
        message: result.message || result.errors?.join(', ') || 'Operation failed',
      };
    }

    revalidatePath(EVENTS_PATH);
    return { success: true, message: successMessage };
  } catch (error) {
    console.error('Action Error:', error); // Log for server-side debugging
    return { success: false, message: 'A server error occurred' };
  }
}

export async function createEventAction(data: EventCreate) {
  const validated = EventCreateSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  const { company, contact, role, eventTypeId, occurredAt, summary, details, source, direction } =
    validated.data;

  // Use boolean casting to satisfy the "string | undefined" to "boolean" check
  const isCompanyCreation = !!(company?.isNew && company.name);
  const isContactCreation = !!(contact?.isNew && contact.firstName && contact.lastName);
  const isRoleCreation = !!(role?.isNew && role.title);

  const dto: EventCreateDto = {
    summary: summary,
    details: details,
    occurredAt,
    source,
    direction,

    // Mapping IDs: Ensure we fallback to null/undefined instead of non-null assertion
    companyId: company && !company.isNew ? company.id : undefined,
    newCompany: isCompanyCreation ? { name: company.name ?? '' } : undefined,

    contactId: contact && !contact.isNew ? contact.id : undefined,
    newContact: isContactCreation
      ? { firstName: contact.firstName ?? '', lastName: contact.lastName ?? '' }
      : undefined,

    roleId: role && !role.isNew ? role.id : undefined,
    newRole: isRoleCreation ? { title: role.title ?? '', level: RoleLevel.ScrumMaster } : undefined,

    // Resolve the 'number | null' issue by providing a fallback
    // (Zod ensures this won't be 0, but TS needs to see a number)
    eventTypeId: eventTypeId ?? 0,

    // Placeholder for non-nullable nested DTO
    newEventType: { id: 0, name: '', isSystemDefined: false },
  };

  return handleActionResult(createEvent(dto), 'Event created!');
}

export async function updateEventAction(id: number, data: EventUpdate) {
  const validated = EventUpdateSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  const { company, contact, role, eventTypeId, ...fields } = validated.data;

  const dto: EventUpdateDto = {
    ...fields,
    eventTypeId: eventTypeId ?? 0,

    // Company Relation
    companyId: company?.shouldRemove ? -1 : company?.isNew ? undefined : company?.id,
    updateCompany: company?.isNew ? { name: company.name } : undefined,

    // Contact Relation
    contactId: contact?.shouldRemove ? -1 : contact?.isNew ? undefined : contact?.id,
    updateContact: contact?.isNew
      ? {
          firstName: contact.firstName,
          lastName: contact.lastName,
        }
      : undefined,

    // Role Relation
    roleId: role?.shouldRemove ? -1 : role?.isNew ? undefined : role?.id,
    updateRole: role?.isNew ? { title: role.title } : undefined,
  };

  return handleActionResult(updateEvent(id, dto), 'Event updated!');
}

export async function deleteEventAction(id: number) {
  try {
    await deleteEvent(id);
    revalidatePath(EVENTS_PATH);
    return { success: true, message: 'Event deleted!' };
  } catch (error) {
    return { success: false, message: 'Delete failed' };
  }
}
