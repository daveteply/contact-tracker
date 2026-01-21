'use client';

import { RoleReadDto } from '@contact-tracker/api-models';
import ExternalLink from '../common/external-link';

export interface RoleCardProps {
  role: RoleReadDto;
}

export function RoleInfoCard({ role }: RoleCardProps) {
  return (
    <div className="card w-50 bg-base-100 card-sm shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{role.title}</h2>
        <ul>
          <li>{role.level}</li>
          <li>
            <ExternalLink url={role.jobPostingUrl} />
          </li>
          <li>{role.location}</li>
        </ul>
      </div>
    </div>
  );
}

export default RoleInfoCard;
