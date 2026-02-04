import { fetchCompanies } from '@/lib/server/clients/companies-client';
import { CompanyList } from '@contact-tracker/ui-shared';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function CompanyListPage() {
  const companies = await fetchCompanies();

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
