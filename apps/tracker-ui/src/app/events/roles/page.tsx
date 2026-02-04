import { fetchRoles } from '@/lib/server/clients/roles-client';
import { RoleList } from '@contact-tracker/ui-shared';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function RoleListPage() {
  const roles = await fetchRoles();

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-1">Roles</h1>
        <Link className="btn btn-circle btn-sm text-primary" href="roles/new" title="Add new Role">
          <PlusCircleIcon className="size-5" />
        </Link>
      </div>

      <RoleList roles={roles} />
    </>
  );
}
