'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CompanyCreateDtoSchema, CompanyUpdateDtoSchema } from '@contact-tracker/validation';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';

type CompanyCreateInput = z.infer<typeof CompanyCreateDtoSchema>;
type CompanyUpdateInput = z.infer<typeof CompanyUpdateDtoSchema>;

interface CompanyFormProps {
  onSubmitAction:
    | ((data: CompanyCreateInput) => Promise<{ success: boolean; message: string }>)
    | ((data: CompanyUpdateInput) => Promise<{ success: boolean; message: string }>);
  initialData?: CompanyCreateInput | CompanyUpdateInput;
  isEdit?: boolean;
}

export function CompanyForm({ onSubmitAction, initialData, isEdit = false }: CompanyFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const schema = isEdit ? CompanyUpdateDtoSchema : CompanyCreateDtoSchema;
  type FormInput = CompanyCreateInput | CompanyUpdateInput;

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema as any),
    defaultValues: initialData as FormInput,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData as FormInput);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormInput) => {
    // For update flows we need to detect intentionally-cleared fields.
    // `data` is the parsed result from zod resolver (preprocess may have converted empty strings to undefined).
    // Use raw values to detect empty-string clears and map them to `null` for PATCH semantics.
    const raw = getValues();
    const payload: any = { ...data };

    if (isEdit) {
      // Name must not be cleared on edit
      if (raw.name === '' || payload.name === '' || payload.name === null || payload.name === undefined) {
        showToast('Company name is required', 'error');
        return;
      }

      // If website input was cleared (raw === ''), send explicit null to clear on backend
      if (raw.website === '') {
        payload.website = null;
      }
    }

    try {
      const result = await onSubmitAction(payload as never);
      if (result.success) {
        showToast(`Company ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push('/events/companies');
      } else {
        // TODO log this
        showToast('Could not save Company', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company Name</legend>
        <input className="input" {...register('name')} />
        <p className="label">Required</p>
        <p className="text-red-600">{errors.name && <span>{errors.name.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Website</legend>
        <input className="input" {...register('website')} />
        <p className="text-red-600">{errors.website && <span>{errors.website.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Industry</legend>
        <input className="input" {...register('industry')} />
        <p className="text-red-600">{errors.industry && <span>{errors.industry.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Size Range</legend>
        <input className="input" {...register('sizeRange')} />
        <p className="text-red-600">
          {errors.sizeRange && <span>{errors.sizeRange.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Notes</legend>
        <textarea className="textarea" {...register('notes')} />
        <p className="text-red-600">{errors.notes && <span>{errors.notes.message}</span>}</p>
      </fieldset>

      <button className="btn mt-4" type="submit" disabled={isSubmitting}>
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  );
}

export default CompanyForm;
