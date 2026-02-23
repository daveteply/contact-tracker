'use client';

import { RoleReadDto } from '@contact-tracker/api-models';
import RoleInfoCard from './role-info-card';

export interface RoleListProps {
  roles: RoleReadDto[];
}

export function RoleList({ roles }: RoleListProps) {
  return (
    <div className="flex flex-col gap-3">
      {roles && roles.length ? (
        <>
          {roles.map((Role: RoleReadDto) => (
            <RoleInfoCard key={Role.id} role={Role} />
          ))}
        </>
      ) : (
        <p>No Roles found</p>
      )}
    </div>
  );
}

export default RoleList;
