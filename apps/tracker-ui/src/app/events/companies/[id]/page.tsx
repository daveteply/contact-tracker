'use client';

import { useCompany } from '@contact-tracker/data-access';
import { CompanyInfoCard, PageLoading } from '@contact-tracker/ui-components';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { use } from 'react';

export default function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { company, loading, error } = useCompany(id);

  if (loading) {
    return <PageLoading entityName="company" />;
  }

  if (error || !company) {
    return <div>Company not found</div>;
  }

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Company Details</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${id}/edit`}
          title="Edit Company"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title="Delete Company"
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <CompanyInfoCard company={company} showControls={false} />

      <div className="mt-5">
        <Link className="btn mr-3" href="./">
          Back to Companies
        </Link>
        <Link className="btn" href="../">
          Back to Events
        </Link>
      </div>
    </>
  );
}
