'use client';

import { ApiResult } from '@contact-tracker/api-models';
import { useRouter } from 'next/navigation';
import { useToast } from './toast-context';

export interface EntityDeleteProps {
  id: number;
  onDeleteAction: (id: number) => Promise<ApiResult<void>>;
  entityName: string;
  postActionRoute: string;
}

export function EntityDelete({
  id,
  onDeleteAction,
  entityName,
  postActionRoute,
}: EntityDeleteProps) {
  const router = useRouter();
  const { showToast } = useToast();

  function handleDelete(id: number) {
    return async () => {
      const result = await onDeleteAction(id);
      if (result.success) {
        showToast(`${entityName} deleted successfully!`, 'success');
        router.push(postActionRoute);
      } else {
        // TODO log this
        showToast(`Could not delete ${entityName}`, 'error');
      }
    };
  }

  return (
    <>
      <p className="text-error italic">Reminder: This action cannot be undone</p>
      <button className="btn btn-error" onClick={handleDelete(id)}>
        Delete this <span className="capitalize">{entityName}</span>
      </button>
    </>
  );
}

export default EntityDelete;
