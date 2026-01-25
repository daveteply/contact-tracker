'use server';

import { ContactInput, ContactInputSchema } from '@contact-tracker/validation';
import { createContact, deleteContact, updateContact } from '../clients/contacts-client';
import { revalidatePath } from 'next/cache';
import { ApiResult, ContactReadDto } from '@contact-tracker/api-models';

const CONTACTS_PATH = '/events/contacts';

async function handleActionResult(
  request: Promise<ApiResult<ContactReadDto>>,
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

    revalidatePath(CONTACTS_PATH);
    return { success: true, message: successMessage };
  } catch (error) {
    console.error('Action Error:', error); // Log for server-side debugging
    return { success: false, message: 'A server error occurred' };
  }
}

export async function createContactAction(data: ContactInput) {
  const validated = ContactInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  return handleActionResult(createContact(data), 'Contact created!');
}

export async function updateContactAction(id: number, data: ContactInput) {
  const validated = ContactInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  return handleActionResult(updateContact(id, data), 'Contact updated!');
}

export async function deleteContactAction(id: number) {
  try {
    await deleteContact(id);
    revalidatePath(CONTACTS_PATH);
    return { success: true, message: 'Contact deleted!' };
  } catch (error) {
    return { success: false, message: 'Delete failed' };
  }
}
