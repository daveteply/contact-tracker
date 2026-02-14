'use client';

import { CompanyDocumentDto } from '@contact-tracker/api-models';
import CompanyInfoCard from './company-info-card';

export interface CompanyListProps {
  companies: CompanyDocumentDto[];
}

export function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="flex flex-col gap-3">
      {companies && companies.length ? (
        <>
          {companies.map((company) => (
            <CompanyInfoCard key={company.id} company={company} />
          ))}
        </>
      ) : (
        <p>No Companies found</p>
      )}
    </div>
  );
}

export default CompanyList;
