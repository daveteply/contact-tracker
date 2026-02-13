'use client';

import { CompanyForm, PageLoading } from '@contact-tracker/ui-shared';
import { use } from 'react';
import { useDb } from '@/lib/context/db-provider';
import { useCompany } from '@/lib/hooks/companies-use-single';
import { handleLocalCompanyUpdate } from '@/lib/hooks/companies-update';

export default function CompanyUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useDb();
  const { company, loading, error } = useCompany(id);

  if (loading) {
    return <PageLoading entityName="company" />;
  }

  if (error || !company) {
    return <div>Company not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Company</h1>
      <CompanyForm
        onSubmitAction={handleLocalCompanyUpdate(db, id)}
        initialData={company}
        isEdit={true}
      />
    </div>
  );
}
