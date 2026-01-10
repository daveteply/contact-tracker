'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyInput, CompanyInputSchema } from '@contact-tracker/validation';

interface CompanyFormProps {
  onSubmitAction: (
    data: CompanyInput,
  ) => Promise<{ success: boolean; message: string }>;
}

export function CompanyForm({ onSubmitAction }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInput>({
    resolver: zodResolver(CompanyInputSchema),
  });

  const onSubmit = async (data: CompanyInput) => {
    try {
      const result = await onSubmitAction(data);
      if (result.success) {
        // You could redirect here or reset the form
        //alert('Company created successfully!');
      } else {
        //alert(`Error: ${result.message}`);
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company Name</legend>
        <input className="input" {...register('name')} />
        <p className="label">Required</p>
        <p className="text-red-600">
          {errors.name && <span>{errors.name.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Website</legend>
        <input className="input" {...register('website')} />
        <p className="text-red-600">
          {errors.website && <span>{errors.website.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Industry</legend>
        <input className="input" {...register('industry')} />
        <p className="text-red-600">
          {errors.industry && <span>{errors.industry.message}</span>}
        </p>
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
        <p className="text-red-600">
          {errors.notes && <span>{errors.notes.message}</span>}
        </p>
      </fieldset>

      <button className="btn mt-4" type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}

export default CompanyForm;
