import { updateRoleAction } from '@/lib/server/actions/role-actions';
import { searchCompanies } from '@/lib/server/clients/companies-client';
import { fetchRoleById } from '@/lib/server/clients/roles-client';
import { RoleForm } from '@contact-tracker/ui-shared';
import { mapRoleDtoToFormValues } from '@contact-tracker/validation';

export default async function RoleUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roleId = parseInt(id);
  const response = await fetchRoleById(roleId);

  if (!response.data) {
    return <div>Role not found</div>;
  }

  // Transform the data here before passing it to the client component
  const initialData = mapRoleDtoToFormValues(response.data);

  const boundUpdateAction = updateRoleAction.bind(null, roleId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Role</h1>
      <RoleForm
        onSubmitAction={boundUpdateAction}
        initialData={initialData}
        isEdit={true}
        onSearchCompany={searchCompanies}
      />
    </div>
  );
}
