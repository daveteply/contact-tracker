'use client';

import { CompanyReadDto } from '@contact-tracker/api-models';

export interface CompanyCardProps {
  company: CompanyReadDto;
}

export function CompanyInfoCard({ company }: CompanyCardProps) {
  return (
    <div className="card w-50 bg-base-100 card-sm shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{company.name}</h2>
        <ul>
          <li>{company.website}</li>
          <li>{company.industry}</li>
          <li>{company.sizeRange}</li>
          <li>{company.notes}</li>
        </ul>
      </div>
    </div>
  );
}

export default CompanyInfoCard;
