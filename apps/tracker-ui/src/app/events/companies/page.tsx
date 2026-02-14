'use client';

import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { CompanyList } from '@contact-tracker/ui-components';
import { PageLoading } from '@contact-tracker/ui-components';
import { useCompanies } from '@contact-tracker/data-access';

export default function CompanyListPage() {
  const { companies, loading } = useCompanies();

  if (loading) return <PageLoading entityName="companies" />;

  return (
    <>
      <div className="flex mb-3 justify-between">
        <h1 className="text-xl pr-1">Companies</h1>
        <Link className="btn btn-sm text-primary" href="companies/new" title="Add Company">
          <PlusCircleIcon className="size-5" />
          Add Company
        </Link>
      </div>

      <CompanyList companies={companies} />
    </>
  );
}
