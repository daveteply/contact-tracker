import {
  canDeleteCompany,
  deleteCompany,
  fetchCompanyById,
} from '@/lib/server/clients/companies-client';
import { EntityDelete, CompanyInfoCard } from '@contact-tracker/ui-shared';
import Link from 'next/link';

export default async function CompanyDeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = parseInt(id);

  const result = await fetchCompanyById(companyId);
  const company = result.data;

  const canDelete = await canDeleteCompany(companyId);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl pr-1">Company - Delete</h1>
      {company ? (
        <>
          <CompanyInfoCard company={company} showControls={false} />
          {canDelete ? (
            <EntityDelete
              id={company.id}
              entityName="company"
              postActionRoute="/events/companies"
              onDeleteAction={deleteCompany}
            />
          ) : (
            <>
              <p>This Company is associated with Events, Contacts or Roles and cannot be deleted</p>
              <Link className="btn" href="../">
                Back to Companies
              </Link>
              <Link className="btn" href="../../">
                Back to Events
              </Link>
            </>
          )}
        </>
      ) : (
        <div>Company Not Found</div>
      )}
    </div>
  );
}
