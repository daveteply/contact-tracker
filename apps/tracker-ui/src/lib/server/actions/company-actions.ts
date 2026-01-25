'use server';

import { CompanyInput, CompanyInputSchema } from '@contact-tracker/validation';
import { createCompany, updateCompany, deleteCompany } from '../clients/companies-client';
import { revalidatePath } from 'next/cache';
import { ApiResult, CompanyReadDto } from '@contact-tracker/api-models';

const COMPANIES_PATH = '/events/companies';

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

export async function createCompanyAction(data: CompanyInput) {
  const validated = CompanyInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  return handleActionResult(createCompany(data), 'Company created!');
}

export async function updateCompanyAction(id: number, data: CompanyInput) {
  const validated = CompanyInputSchema.safeParse(data);
  if (!validated.success) return { success: false, message: 'Invalid data' };

  return handleActionResult(updateCompany(id, data), 'Company updated!');
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
