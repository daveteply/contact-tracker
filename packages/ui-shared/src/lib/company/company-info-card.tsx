'use client';

import { CompanyReadDto } from '@contact-tracker/api-models';
import ExternalLink from '../common/external-link';

export interface CompanyCardProps {
  company: CompanyReadDto;
  renderFull?: boolean;
}

export function CompanyInfoCard({ company, renderFull = true }: CompanyCardProps) {
  return (
    <div className="card w-50 bg-base-100 card-sm shadow-sm">
      <div className="card-body">
        {renderFull ? (
          <>
            <h2 className="card-title">{company.name}</h2>
            <ul>
              <li>
                <ExternalLink url={company.website} iconOnly={!renderFull} />
              </li>
              <li>{company.industry}</li>
              <li>{company.sizeRange}</li>
              <li>{company.notes}</li>
            </ul>
          </>
        ) : (
          <div className="flex">
            <h2 className="card-title pr-1">{company.name}</h2>
            <ExternalLink url={company.website} iconOnly={!renderFull} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyInfoCard;
