'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleFormValues, RoleInput, RoleInputSchema } from '@contact-tracker/validation';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';
import { CompanyReadDto } from '@contact-tracker/api-models';
import CompanyCombobox from '../company/company-combobox';

interface RoleFormProps {
  onSubmitAction: (data: RoleInput) => Promise<{ success: boolean; message: string }>;
  onSearchCompany: (query: string) => Promise<CompanyReadDto[]>;
  initialData?: RoleFormValues;
  isEdit?: boolean;
}

export function RoleForm({
  onSubmitAction,
  onSearchCompany,
  initialData,
  isEdit = false,
}: RoleFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(RoleInputSchema),
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: RoleFormValues) => {
    try {
      const result = await onSubmitAction(data as RoleInput);
      if (result.success) {
        showToast(`Role ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push('/events/roles');
      } else {
        // TODO log this
        showToast('Could not save Role', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Title</legend>
        <input className="input" {...register('title')} />
        <p className="label">Required</p>
        <p className="text-red-600">{errors.title && <span>{errors.title.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company</legend>
        <CompanyCombobox control={control} name="company" onSearch={onSearchCompany} required />
        {errors.company?.name && <p className="text-red-600">{errors.company.name.message}</p>}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Job Posting URL</legend>
        <input className="input" {...register('jobPostingUrl')} />
        <p className="text-red-600">
          {errors.jobPostingUrl && <span>{errors.jobPostingUrl.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Location</legend>
        <input className="input" {...register('location')} />
        <p className="text-red-600">{errors.location && <span>{errors.location.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Level</legend>
        <input className="input" {...register('level')} />
        <p className="text-red-600">{errors.level && <span>{errors.level.message}</span>}</p>
      </fieldset>

      <button className="btn mt-4" type="submit" disabled={isSubmitting}>
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  );
}

export default RoleForm;
