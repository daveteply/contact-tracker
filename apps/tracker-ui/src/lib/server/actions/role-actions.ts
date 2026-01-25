'use server';

import { RoleInput, RoleInputSchema } from '@contact-tracker/validation';
import { createRole, updateRole, deleteRole } from '../clients/roles-client';
import { revalidatePath } from 'next/cache';
import { ApiResult, RoleReadDto } from '@contact-tracker/api-models';

const ROLES_PATH = '/events/roles';

async function handleActionResult(
  request: Promise<ApiResult<RoleReadDto>>,
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

    revalidatePath(ROLES_PATH);
    return { success: true, message: successMessage };
  } catch (error) {
    console.error('Action Error:', error); // Log for server-side debugging
    return { success: false, message: 'A server error occurred' };
  }
}

export async function createRoleAction(data: RoleInput) {
  const validated = RoleInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  return handleActionResult(createRole(data), 'Role created!');
}

export async function updateRoleAction(id: number, data: RoleInput) {
  const validated = RoleInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  return handleActionResult(updateRole(id, data), 'Role updated!');
}

export async function deleteRoleAction(id: number) {
  try {
    await deleteRole(id);
    revalidatePath(ROLES_PATH);
    return { success: true, message: 'Role deleted!' };
  } catch (error) {
    return { success: false, message: 'Delete failed' };
  }
}
