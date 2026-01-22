import { fetchCompanyById } from '@/lib/server/clients/company-client';
import { CompanyInfoCard } from '@contact-tracker/ui-shared';

export default async function DeleteCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = parseInt(id);

  const result = await fetchCompanyById(companyId);
  const company = result.data;

  

  return (
    <>
      <h1 className="text-xl pr-1">Company - Delete</h1>
      {company ? (
        <>
          <p className="mb-5 italic text-error">Are you sure? This can not be undone!</p>
          <div>
            <CompanyInfoCard company={company} showControls={false} />
          </div>
        </>
      ) : (
        <div>Company Not Found</div>
      )}
    </>
  );
}
