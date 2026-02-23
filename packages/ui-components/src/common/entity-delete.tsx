'use client';

import { useRouter } from 'next/navigation';
import { useToast } from './toast-context';

export interface EntityDeleteProps {
  id: string;
  onDeleteAction: (id: string) => Promise<{ success: boolean; message: string }>;
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

  function handleDelete(id: string) {
    return async () => {
      try {
        await onDeleteAction(id);
        showToast(`${entityName} deleted successfully!`, 'success');
        router.push(postActionRoute);
      } catch (error) {
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
