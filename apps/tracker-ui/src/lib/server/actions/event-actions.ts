'use server';

import { EventInput, EventInputSchema } from '@contact-tracker/validation';
import { createEvent, deleteEvent, updateEvent } from '../clients/events-client';
import { revalidatePath } from 'next/cache';
import { ApiResult, EventCreateDto, EventReadDto, RoleLevel } from '@contact-tracker/api-models';

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

  console.log('DTO being sent to API:', JSON.stringify(dto, null, 2)); // ← Add this

  return handleActionResult(createEvent(dto), 'Event created!');
}

export async function updateEventAction(id: number, data: EventInput) {
  const validated = EventInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  return handleActionResult(updateEvent(id, data), 'Event updated!');
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
