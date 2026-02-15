'use client';

import { use } from 'react';
import Link from 'next/link';
import { CompanyInfoCard, EntityDelete, PageLoading } from '@contact-tracker/ui-components';
import { useCanDeleteCompany, useCompany, useCompanyMutations } from '@contact-tracker/data-access';

export default function CompanyDeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { company, loading: companyLoading, error } = useCompany(id);
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteCompany(id);
  const { delete: deleteCompany } = useCompanyMutations();

  if (companyLoading || deleteCheckLoading) {
    return <PageLoading entityName="company" />;
  }

  if (error || !company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl pr-1">Company - Delete</h1>

      <>
        <CompanyInfoCard company={company} showControls={false} />
        {canDelete ? (
          <div>
            <EntityDelete
              id={company.id}
              entityName="company"
              postActionRoute="/events/companies"
              onDeleteAction={(id) => deleteCompany(id)}
            />
          </div>
        ) : (
          <>
            <p>{`This Company is associated with
                 ${blockers.events} Event(s), 
                 ${blockers.contacts} Contact(s) or 
                 ${blockers.roles} Role(s) and cannot be deleted`}</p>
            <Link className="btn" href="../">
              Back to Companies
            </Link>
            <Link className="btn" href="../../">
              Back to Events
            </Link>
          </>
        )}
      </>
    </div>
  );
}
