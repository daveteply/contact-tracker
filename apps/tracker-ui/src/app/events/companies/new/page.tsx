import { createCompanyAction } from '@/lib/server/actions/company-actions';
import { CompanyForm } from '@contact-tracker/ui-shared';

export default async function CreateCompanyPage() {
  return (
    <>
      <h1 className="text-xl mb-5">Companies - new Company</h1>
      <p className="mb-5 italic"></p>

      <CompanyForm onSubmitAction={createCompanyAction}></CompanyForm>
    </>
  );
}
