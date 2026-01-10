import { saveCompany } from '@/lib/server/actions/company-actions';
import { CompanyForm } from '@contact-tracker/ui-shared';

export default async function Index() {
  return (
    <div>
      <CompanyForm onSubmitAction={saveCompany} />
    </div>
  );
}
