import { createCompanyAction } from '@/lib/server/actions/company-actions';
import { CompanyForm } from '@contact-tracker/ui-shared';

export default async function CreateCompanyPage() {
  return (
    <div>
      <CompanyForm onSubmitAction={createCompanyAction} />
    </div>
  );
}
