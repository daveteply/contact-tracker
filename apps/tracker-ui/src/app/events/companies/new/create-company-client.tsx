'use client';

import { CompanyCreateSchema } from '@contact-tracker/validation';
import { createCompanyAction } from '@/lib/server/actions/company-actions';
import { CompanyForm } from '@contact-tracker/ui-shared';

export function CreateCompanyClientPage() {
  return <CompanyForm schema={CompanyCreateSchema} onSubmitAction={createCompanyAction} />;
}
