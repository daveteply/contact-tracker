'use server';

import { deleteContact } from '../clients/contacts-client';
import { revalidatePath } from 'next/cache';

const CONTACTS_PATH = '/events/contacts';

// async function handleActionResult(
//   request: Promise<ApiResult<ContactReadDto>>,
//   successMessage: string,
// ) {
//   try {
//     const result = await request;

//     if (!result.success) {
//       return {
//         success: false,
//         message: result.message || result.errors?.join(', ') || 'Operation failed',
//       };
//     }

//     revalidatePath(CONTACTS_PATH);
//     return { success: true, message: successMessage };
//   } catch (error) {
//     console.error('Action Error:', error); // Log for server-side debugging
//     return { success: false, message: 'A server error occurred' };
//   }
// }

// export async function createContactAction(data: ContactCreate) {
//   const validated = ContactCreateSchema.safeParse(data);
//   if (!validated.success) return { success: false, message: 'Invalid data' };

//   const { company, ...contactFields } = validated.data;

//   // Use type narrowing to ensure name is a string before building the nested DTO
//   const isCreation = company?.isNew && typeof company.name === 'string';

//   // Aligning with the Event logic:
//   // Map to ContactCreateDto expected by .NET
//   const dto: ContactCreateDto = {
//     ...contactFields,
//     companyId: company && !company.isNew ? company.id : undefined,
//     newCompany: isCreation ? { name: company.name as string } : undefined,
//   };

//   return handleActionResult(createContact(dto), 'Contact created!');
// }

// export async function updateContactAction(id: number, data: ContactUpdate) {
//   const validated = ContactUpdateSchema.safeParse(data);
//   if (!validated.success) return { success: false, message: 'Invalid data' };

//   const { company, ...updateFields } = validated.data;

//   const dto: ContactUpdateDto = {
//     ...updateFields,
//     // Explicitly mapping the selection object to the DTO
//     companyId: company?.shouldRemove ? -1 : company?.isNew ? undefined : company?.id,
//     // Note: If your backend supports updating/replacing company info via Contact Patch:
//     updateCompany: company?.isNew ? { name: company.name } : undefined,
//   };

//   return handleActionResult(updateContact(id, dto), 'Contact updated!');
// }

export async function deleteContactAction(id: number) {
  try {
    await deleteContact(id);
    revalidatePath(CONTACTS_PATH);
    return { success: true, message: 'Contact deleted!' };
  } catch (error) {
    return { success: false, message: 'Delete failed' };
  }
}
