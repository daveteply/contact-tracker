'use client';

import { useCompanyMutations } from '@contact-tracker/data-access';
import { CompanyForm } from '@contact-tracker/ui-components';

export default function CreateCompanyPage() {
  const { create } = useCompanyMutations();

  return (
    <>
      <h1 className="text-xl mb-5">Companies - new Company</h1>
      <p className="mb-5 italic"></p>

      {<CompanyForm onSubmitAction={create} />}
    </>
  );
}
