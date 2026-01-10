import { deleteCompanyAction } from '@/lib/server/actions/company-actions';
import { fetchCompanies } from '@/lib/server/clients/company-client';
import { CompanyList } from '@contact-tracker/ui-shared';
import Link from 'next/link';

export default async function CompanyListPage() {
  const companies = await fetchCompanies();

  return (
    <div>
      <Link className="btn" href="companies/new">
        Add New Company
      </Link>
      <CompanyList companies={companies} onDeleteAction={deleteCompanyAction} />
    </div>
  );
}
