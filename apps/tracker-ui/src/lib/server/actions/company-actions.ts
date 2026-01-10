'use server';

import { CompanyInput, CompanyInputSchema } from '@contact-tracker/validation';
import { createCompany } from '../clients/company-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveCompany(data: CompanyInput) {
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
