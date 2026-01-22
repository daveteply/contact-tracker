'use client';

import { RoleReadDto } from '@contact-tracker/api-models';
import ExternalLink from '../common/external-link';

export interface RoleCardProps {
  role: RoleReadDto;
  renderFull?: boolean;
}

export function RoleInfoCard({ role, renderFull = true }: RoleCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {renderFull ? (
          <>
            <h2 className="card-title">{role.title}</h2>
            <ul>
              <li>{role.level}</li>
              <li>
                <ExternalLink url={role.jobPostingUrl} iconOnly={!renderFull} />
              </li>
              <li>{role.location}</li>
            </ul>
          </>
        ) : (
          <div className="flex">
            <h2 className="card-title pr-1">{role.title}</h2>
            <ExternalLink url={role.jobPostingUrl} iconOnly={!renderFull} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleInfoCard;
