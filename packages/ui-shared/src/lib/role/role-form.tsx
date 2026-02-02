'use client';

import { useEffect } from 'react';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleCreateSchema, RoleUpdateSchema } from '@contact-tracker/validation';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';
import { CompanyReadDto } from '@contact-tracker/api-models';
import CompanyCombobox from '../company/company-combobox';

interface RoleFormProps<T extends FieldValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  onSearchCompany: (query: string) => Promise<CompanyReadDto[]>;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
}

export function RoleForm<T extends FieldValues>({
  onSubmitAction,
  onSearchCompany,
  initialData,
  isEdit = false,
}: RoleFormProps<T>) {
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? RoleUpdateSchema : RoleCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: T) => {
    try {
      const result = await onSubmitAction(data);
      if (result.success) {
        showToast(`Role ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push('/events/roles');
      } else {
        // TODO log this
        showToast(result.message || 'Could not save Role', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  // Helper to render error messages cleanly
  const ErrorMsg = ({ name }: { name: Path<T> }) => {
    const error = errors[name];
    if (!error) return null;
    return (
      <p className="text-red-600">
        <span>{error.message?.toString()}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Title</legend>
        <input className="input" {...register('title' as Path<T>)} />
        <p className="label">Required</p>
        <ErrorMsg name={'title' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company</legend>
        <CompanyCombobox control={control} name={'company' as Path<T>} onSearch={onSearchCompany} />
        <ErrorMsg name={'company' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Job Posting URL</legend>
        <input className="input" {...register('jobPostingUrl' as Path<T>)} />
        <ErrorMsg name={'jobPostingUrl' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Location</legend>
        <input className="input" {...register('location' as Path<T>)} />
        <ErrorMsg name={'location' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Level</legend>
        <input className="input" {...register('level' as Path<T>)} />
        <ErrorMsg name={'level' as Path<T>} />
      </fieldset>

      <button className="btn mt-4" type="submit" disabled={isSubmitting}>
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  );
}

export default RoleForm;
