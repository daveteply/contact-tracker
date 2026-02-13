'use client';

import { CompanyForm } from '@contact-tracker/ui-shared';
import { useDb } from '@/lib/context/db-provider';
import { handleLocalCompanyCreate } from '@/lib/hooks/companies-insert';

export default function CreateCompanyPage() {
  const db = useDb();

  return (
    <>
      <h1 className="text-xl mb-5">Companies - new Company</h1>
      <p className="mb-5 italic"></p>

      <CompanyForm onSubmitAction={handleLocalCompanyCreate(db)}></CompanyForm>
    </>
  );
}
