import { fetchCompanyById } from '@/lib/server/clients/companies-client';
import { CompanyInfoCard } from '@contact-tracker/ui-shared';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = parseInt(id);
  const response = await fetchCompanyById(companyId);
  const company = response.data;

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Company Details</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${companyId}/edit`}
          title="Edit Company"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${companyId}/delete`}
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
