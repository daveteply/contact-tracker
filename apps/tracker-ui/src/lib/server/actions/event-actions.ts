'use server';

import { EventInput, EventInputSchema } from '@contact-tracker/validation';
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

export async function createEventAction(data: EventInput) {
  const validated = EventInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  const dto: EventCreateDto = {
    companyId: !data.company.isNew ? data.company.id : undefined,
    newCompany: data.company.isNew ? { name: data.company.name } : undefined,

    contactId: !data.contact.isNew ? data.contact.id : undefined,
    newContact: data.contact.isNew
      ? { firstName: data.contact.firstName, lastName: data.contact.lastName }
      : undefined,

    roleId: !data.role.isNew ? data.role.id : undefined,
    newRole: data.role.isNew
      ? { title: data.role.title, level: RoleLevel.EngineeringManager }
      : undefined,

    eventTypeId: data.eventTypeId,
    occurredAt: data.occurredAt,
    summary: data.summary,
    details: data.details,
    source: data.source,
    direction: data.direction,
  };

  return handleActionResult(createEvent(dto), 'Event created!');
}

export async function updateEventAction(id: number, data: EventInput) {
  const validated = EventInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  // Prepare the Company (shared by Event and Role)
  const sharedCompanyUpdate = data.company.isNew ? { name: data.company.name } : undefined;

  // Logic Change: If it's new, the ID must be undefined/null
  // to prevent EF from updating the existing linked entity.
  const dto: EventUpdateDto = {
    // Top-level Event -> Company Link
    companyId: !data.company.isNew ? data.company.id : undefined,
    updateCompany: sharedCompanyUpdate,

    // Top-level Event -> Contact Link
    contactId: !data.contact.isNew ? data.contact.id : undefined,
    updateContact: data.contact.isNew
      ? { firstName: data.contact.firstName, lastName: data.contact.lastName }
      : undefined,

    // Top-level Event -> Role Link
    roleId: !data.role.isNew ? data.role.id : undefined,
    updateRole: data.role.isNew
      ? {
          title: data.role.title,
          level: RoleLevel.EngineeringManager,
          // CRITICAL: Link the new role to the same company info
          // If company is existing, pass its ID. If new, pass the new info.
          companyId: !data.company.isNew ? data.company.id : undefined,
          company: sharedCompanyUpdate,
        }
      : undefined,

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
