import { createRoleAction } from '@/lib/server/actions/role-actions';
import { searchCompanies } from '@/lib/server/clients/companies-client';
import { RoleForm } from '@contact-tracker/ui-components';

export default async function CreateRolePage() {
  return (
    <div>
      <h1 className="text-xl">Roles - new Role</h1>
      <RoleForm onSubmitAction={createRoleAction} onSearchCompany={searchCompanies} />
    </div>
  );
}
