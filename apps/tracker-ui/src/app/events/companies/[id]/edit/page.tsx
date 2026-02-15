'use client';

import { useCompany, useCompanyMutations } from '@contact-tracker/data-access';
import { CompanyForm, PageLoading } from '@contact-tracker/ui-components';
import Link from 'next/link';
import { use } from 'react';

export default function CompanyUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { company, loading, error } = useCompany(id);
  const { update } = useCompanyMutations();

  if (loading) {
    return <PageLoading entityName="company" />;
  }

  if (error || !company) {
    return (
      <>
        <p className="mb-3">Company not found</p>
        <Link className="btn" href="../">
          Back to Companies
        </Link>
      </>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Company</h1>
      {
        <CompanyForm
          onSubmitAction={(data) => update(id, data)}
          initialData={company}
          isEdit={true}
        />
      }
    </div>
  );
}
