import { updateCompanyAction } from '@/lib/server/actions/company-actions';
import { fetchCompanyById } from '@/lib/server/clients/companies-client';
import { CompanyForm } from '@contact-tracker/ui-shared';

export default async function CompanyUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = parseInt(id);
  const response = await fetchCompanyById(companyId);

  if (!response.success) {
    return <div>Company not found</div>;
  }

  const boundUpdateAction = updateCompanyAction.bind(null, companyId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Company</h1>
      <CompanyForm onSubmitAction={boundUpdateAction} initialData={response.data} isEdit={true} />
    </div>
  );
}
