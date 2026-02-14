'use client';

import { CompanyReadDto } from '@contact-tracker/api-models';
import CompanyInfoCard from './company-info-card';

export interface CompanyListProps {
  companies: CompanyReadDto[];
}

export function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="flex flex-col gap-3">
      {companies && companies.length ? (
        <>
          {companies.map((company: CompanyReadDto) => (
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
