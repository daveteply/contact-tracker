import { updateRoleAction } from '@/lib/server/actions/role-actions';
import { searchCompanies } from '@/lib/server/clients/companies-client';
import { fetchRoleById } from '@/lib/server/clients/roles-client';
import { RoleForm } from '@contact-tracker/ui-components';

export default async function RoleUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roleId = parseInt(id);
  const response = await fetchRoleById(roleId);

  if (!response.data) {
    return <div>Role not found</div>;
  }

  const boundUpdateAction = updateRoleAction.bind(null, roleId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Role</h1>
      <RoleForm
        onSubmitAction={boundUpdateAction}
        initialData={response.data}
        isEdit={true}
        onSearchCompany={searchCompanies}
      />
    </div>
  );
}
