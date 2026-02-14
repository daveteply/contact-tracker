import { fetchRoleById } from '@/lib/server/clients/roles-client';
import { RoleInfoCard } from '@contact-tracker/ui-components';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function RoleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roleId = parseInt(id);
  const response = await fetchRoleById(roleId);
  const role = response.data;

  if (!role) {
    return <div>Role not found</div>;
  }

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Role Details</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${roleId}/edit`}
          title="Edit Role"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${roleId}/delete`}
          title="Delete Role"
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <RoleInfoCard role={role} showControls={false} />

      <div className="mt-5">
        <Link className="btn mr-3" href="./">
          Back to Roles
        </Link>
        <Link className="btn" href="../">
          Back to Events
        </Link>
      </div>
    </>
  );
}
