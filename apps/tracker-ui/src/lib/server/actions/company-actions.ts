'use server';

import {
  CompanyCreateDtoSchema,
  CompanyCreateInput,
  CompanyUpdateDtoSchema,
  CompanyUpdateInput,
} from '@contact-tracker/validation';
import { createCompany, updateCompany, deleteCompany } from '../clients/companies-client';
import { revalidatePath } from 'next/cache';
import {
  ApiResult,
  CompanyReadDto,
  CompanyCreateDto,
  CompanyUpdateDto,
} from '@contact-tracker/api-models';

const COMPANIES_PATH = '/events/companies';

// Convert null values to undefined to match backend DTO expectations
function sanitizeNulls<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value]),
  );
}

async function handleActionResult(
  request: Promise<ApiResult<CompanyReadDto>>,
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

    revalidatePath(COMPANIES_PATH);
    return { success: true, message: successMessage };
  } catch (error) {
    console.error('Action Error:', error); // Log for server-side debugging
    return { success: false, message: 'A server error occurred' };
  }
}

export async function createCompanyAction(data: CompanyCreateInput) {
  const validated = CompanyCreateDtoSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  const sanitized = sanitizeNulls(validated.data) as unknown as CompanyCreateDto;
  return handleActionResult(createCompany(sanitized), 'Company created!');
}

export async function updateCompanyAction(id: number, data: CompanyUpdateInput) {
  const validated = CompanyUpdateDtoSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  const sanitized = sanitizeNulls(validated.data) as unknown as CompanyUpdateDto;
  return handleActionResult(updateCompany(id, sanitized), 'Company updated!');
}

export async function deleteCompanyAction(id: number) {
  try {
    await deleteCompany(id);
    revalidatePath(COMPANIES_PATH);
    return { success: true, message: 'Company deleted!' };
  } catch (error) {
    return { success: false, message: 'Delete failed' };
  }
}
