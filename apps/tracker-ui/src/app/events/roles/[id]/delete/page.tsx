import { fetchRoleById } from '@/lib/server/clients/roles-client';
import { RoleInfoCard } from '@contact-tracker/ui-components';

export default async function RoleDeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roleId = parseInt(id);

  const result = await fetchRoleById(roleId);
  const role = result.data;

  // const canDelete = await canDeleteRole(roleId);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl pr-1">Role - Delete</h1>
      {role ? (
        <>
          <RoleInfoCard role={role} showControls={false} />
          {/* {canDelete ? (
            <EntityDelete
              id={role.id}
              entityName="role"
              postActionRoute="/events/roles"
              onDeleteAction={deleteRole}
            />
          ) : (
            <>
              <p>This Role is associated with Events and cannot be deleted</p>
              <Link className="btn" href="../">
                Back to Roles
              </Link>
              <Link className="btn" href="../../">
                Back to Events
              </Link>
            </>
          )} */}
        </>
      ) : (
        <div>Role Not Found</div>
      )}
    </div>
  );
}
