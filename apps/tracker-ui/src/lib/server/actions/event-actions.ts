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

  // const { company, contact, role, ...eventFields } = validated.data;

  // Prepare the Company (shared by Event and Role)
  // const sharedCompanyUpdate = company && company.isNew ? { name: company.name } : undefined;

  // Logic Change: If it's new, the ID must be undefined/null
  // to prevent EF from updating the existing linked entity.
  const dto: EventUpdateDto = {
    // Top-level Event -> Company Link
    // companyId: !data.company.isNew ? data.company.id : undefined,
    // updateCompany: sharedCompanyUpdate,

    // // Top-level Event -> Contact Link
    // contactId: !data.contact.isNew ? data.contact.id : undefined,
    // updateContact: data.contact.isNew
    //   ? { firstName: data.contact.firstName, lastName: data.contact.lastName }
    //   : undefined,

    // // Top-level Event -> Role Link
    // roleId: !data.role.isNew ? data.role.id : undefined,
    // updateRole: data.role.isNew
    //   ? {
    //       title: data.role.title,
    //       level: RoleLevel.EngineeringManager,
    //       // CRITICAL: Link the new role to the same company info
    //       // If company is existing, pass its ID. If new, pass the new info.
    //       companyId: !data.company.isNew ? data.company.id : undefined,
    //       updateCompany: sharedCompanyUpdate,
    //     }
    //   : undefined,

    eventTypeId: data.eventTypeId,
    occurredAt: data.occurredAt,
    summary: data.summary,
    details: data.details,
    source: data.source,
    direction: data.direction,
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
