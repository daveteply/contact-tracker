import { fetchCompanies } from '@/lib/server/clients/company-client';
import { CompanyList } from '@contact-tracker/ui-shared';
import Link from 'next/link';

export default async function Index() {
  const companies = await fetchCompanies();

  return (
    <div>
      <Link className="btn" href="company/new">
        Add New Company
      </Link>
      <CompanyList companyList={companies} />
    </div>
  );
}
