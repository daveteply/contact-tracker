'use client';

import { CompanyDocumentDto } from '@contact-tracker/api-models';
import ExternalLink from '../common/external-link';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export interface CompanyCardProps {
  company: CompanyDocumentDto;
  showFull?: boolean;
  showControls?: boolean;
}

export function CompanyInfoCard({
  company,
  showFull = true,
  showControls = true,
}: CompanyCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {showFull ? (
          <>
            <div className="flex justify-between">
              <h2 className="card-title">{company.name}</h2>
              {showControls && (
                <div className="flex gap-1">
                  <Link href={`/events/companies/${company.id}/edit`}>
                    <PencilIcon className="size-5" />
                  </Link>
                  <Link href={`/events/companies/${company.id}/delete`} className="text-error">
                    <TrashIcon className="size-5" />
                  </Link>
                </div>
              )}
            </div>
            <ul>
              {company.website && (
                <li>
                  <ExternalLink url={company.website} />
                </li>
              )}
              <li>{company.industry}</li>
              <li>{company.sizeRange}</li>
              <li>{company.notes}</li>
            </ul>
          </>
        ) : (
          <div className="flex">
            <h2 className="card-title pr-1">{company.name}</h2>
            <ExternalLink url={company.website} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyInfoCard;
