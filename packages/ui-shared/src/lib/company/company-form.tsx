'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyInput, CompanyInputSchema } from '@contact-tracker/validation';

export function CompanyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyInput>({
    resolver: zodResolver(CompanyInputSchema),
  });

  const onSubmit = (data: CompanyInput) => {
    console.log('Valid data:', data);
    // Send to API
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
        <div className="text-red-600">
          {errors.name && <span>{errors.name.message}</span>}
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Website</legend>
        <input className="input" {...register('website')} />
        {errors.website && <span>{errors.website.message}</span>}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Industry</legend>
        <input className="input" {...register('industry')} />
        {errors.industry && <span>{errors.industry.message}</span>}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Size Range</legend>
        <input className="input" {...register('sizeRange')} />
        {errors.sizeRange && <span>{errors.sizeRange.message}</span>}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Notes</legend>
        <textarea className="textarea" {...register('notes')} />
        {errors.notes && <span>{errors.notes.message}</span>}
      </fieldset>

      <button className="btn mt-4" type="submit">
        Submit
      </button>
    </form>
  );
}

export default CompanyForm;
