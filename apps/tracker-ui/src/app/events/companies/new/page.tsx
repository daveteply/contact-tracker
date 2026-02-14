'use client';

import { handleLocalCompanyCreate, useDb } from '@contact-tracker/data-access';
import { CompanyForm } from '@contact-tracker/ui-components';

export default function CreateCompanyPage() {
  const db = useDb();

  return (
    <>
      <h1 className="text-xl mb-5">Companies - new Company</h1>
      <p className="mb-5 italic"></p>

      {db && <CompanyForm onSubmitAction={handleLocalCompanyCreate(db)}></CompanyForm>}
    </>
  );
}
