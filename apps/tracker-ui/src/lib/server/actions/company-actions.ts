'use server';

import { CompanyInput, CompanyInputSchema } from '@contact-tracker/validation';
import {
  createCompany,
  updateCompany,
  deleteCompany,
} from '../clients/company-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiResult, CompanyReadDto } from '@contact-tracker/api-models';

export async function createCompanyAction(data: CompanyInput) {
  const validated = CompanyInputSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, message: 'Invalid data' };
  }

  let success = false;

  try {
    await createCompany(data);
    success = true;
  } catch (error) {
    return { success: false, message: 'Database/API error occurred' };
  }

  if (success) {
    revalidatePath('/events/companies');
    redirect('/events/companies');
  }

  return { success: true, message: 'Company saved!' };
}

export async function updateCompanyAction(id: number, data: CompanyInput) {
  const validated = CompanyInputSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: 'Invalid data' };
  }

  try {
    const result: ApiResult<CompanyReadDto> = await updateCompany(id, data);
    if (!result.success) {
      // Access the Errors list from your .NET ApiResult
      return {
        success: false,
        message: result.message || result.errors.join(', ') || 'Update failed',
      };
    }
  } catch (error) {
    return { success: false, message: 'Database/API error occurred' };
  }

  revalidatePath('/events/companies');
  redirect('/events/companies');
}

export async function deleteCompanyAction(id: number) {
  let success = false;

  try {
    await deleteCompany(id);
    success = true;
  } catch (error) {
    return { success: false, message: 'Database/API error occurred' };
  }

  if (success) {
    revalidatePath('/events/companies');
    redirect('/events/companies');
  }

  return { success: true, message: 'Company deleted!' };
}
