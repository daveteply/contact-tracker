'use server';

import { CompanyInput, CompanyInputSchema } from '@contact-tracker/validation';
import {
  createCompany,
  updateCompany,
  deleteCompany,
} from '../clients/company-client';
import { revalidatePath } from 'next/cache';
import { ApiResult, CompanyReadDto } from '@contact-tracker/api-models';

export async function createCompanyAction(data: CompanyInput) {
  const validated = CompanyInputSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: 'Invalid data' };
  }

  try {
    const result: ApiResult<CompanyReadDto> = await createCompany(data);
    if (result.success) {
      revalidatePath('/events/companies');
      return { success: result.success, message: 'Company saved!' };
    } else {
      return {
        success: false,
        message: result.message || result.errors.join(', ') || 'Save failed',
      };
    }
  } catch (error) {
    return { success: false, message: 'Database/API error occurred' };
  }
}

export async function updateCompanyAction(id: number, data: CompanyInput) {
  const validated = CompanyInputSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: 'Invalid data' };
  }

  try {
    const result: ApiResult<CompanyReadDto> = await updateCompany(id, data);
    if (result.success) {
      revalidatePath('/events/companies');
      return { success: result.success, message: 'Company saved!' };
    } else {
      return {
        success: false,
        message: result.message || result.errors.join(', ') || 'Update failed',
      };
    }
  } catch (error) {
    return { success: false, message: 'Database/API error occurred' };
  }
}

export async function deleteCompanyAction(id: number) {
  try {
    await deleteCompany(id);
    // Revalidate so the list is fresh when the client navigates/updates
    revalidatePath('/events/companies');
    return { success: true, message: 'Company deleted!' };
  } catch (error) {
    return { success: false, message: 'Database/API error occurred' };
  }
}
