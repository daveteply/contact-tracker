'use server';

import {
  RoleCreate,
  RoleCreateSchema,
  RoleUpdate,
  RoleUpdateSchema,
} from '@contact-tracker/validation';
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

export async function createRoleAction(data: RoleCreate) {
  const validated = RoleCreateSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  const { company, ...contactFields } = validated.data;

  // Aligning with the Event logic:
  // Map to ContactCreateDto expected by .NET
  const dto = {
    ...contactFields,
    companyId: company && !company.isNew ? company.id : undefined,
    newCompany: company?.isNew ? { name: company.name } : undefined,
  };

  return handleActionResult(createRole(dto), 'Role created!');
}

export async function updateRoleAction(id: number, data: RoleUpdate) {
  const validated = RoleUpdateSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  const { company, ...updateFields } = validated.data;

  const dto = {
    ...updateFields,
    // Explicitly mapping the selection object to the DTO
    companyId: company && !company.isNew ? company.id : undefined,
    // Note: If your backend supports updating/replacing company info via Contact Patch:
    updateCompany: company?.isNew ? { name: company.name } : undefined,
  };
  return handleActionResult(updateRole(id, dto), 'Role updated!');
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
