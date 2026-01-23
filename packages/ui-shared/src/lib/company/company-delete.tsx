'use client';

import { ApiResult } from '@contact-tracker/api-models';
import { useRouter } from 'next/navigation';
import { useToast } from '../common/toast-context';

export interface CompanyDeleteProps {
  id: number;
  onDeleteAction: (id: number) => Promise<ApiResult<void>>;
}

export function CompanyDelete({ id, onDeleteAction }: CompanyDeleteProps) {
  const router = useRouter();
  const { showToast } = useToast();

  function handleDelete(id: number) {
    return async () => {
      const result = await onDeleteAction(id);
      if (result.success) {
        showToast('Company deleted successfully!', 'success');
        router.push('/events/companies');
      } else {
        // TODO log this
        showToast('Could not delete Company', 'error');
      }
    };
  }

  return (
    <>
      <p className="text-error italic">Reminder: This action cannot be undone</p>
      <button className="btn btn-error" onClick={handleDelete(id)}>
        Delete this Company
      </button>
    </>
  );
}

export default CompanyDelete;
