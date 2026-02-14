'use client';

import { handleLocalCompanyUpdate, useCompany, useDb } from '@contact-tracker/data-access';
import { CompanyForm, PageLoading } from '@contact-tracker/ui-components';
import { use } from 'react';

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
      {db && (
        <CompanyForm
          onSubmitAction={handleLocalCompanyUpdate(db, id)}
          initialData={company}
          isEdit={true}
        />
      )}
    </div>
  );
}
