'use client';

import Link from 'next/link';
import { use } from 'react';

import { useDb } from '@/lib/context/db-provider';
import { useCanDeleteCompany } from '@/lib/hooks/companies-can-delete';
import { handleLocalCompanyDelete } from '@/lib/hooks/companies-delete';
import { useCompany } from '@/lib/hooks/companies-use-single';
import { EntityDelete, CompanyInfoCard, PageLoading } from '@contact-tracker/ui-components';

export default function CompanyDeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useDb();
  const { company, loading: companyLoading, error } = useCompany(id);
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteCompany(id);

  if (companyLoading || deleteCheckLoading) {
    return <PageLoading entityName="company" />;
  }

  if (error || !company) {
    return <div>Company not found</div>;
  }

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
              onDeleteAction={handleLocalCompanyDelete(db, id)}
            />
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
      ) : (
        <div>Company Not Found</div>
      )}
    </div>
  );
}
