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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Company Name *</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label>Website</label>
        <input {...register('website')} />
        {errors.website && <span>{errors.website.message}</span>}
      </div>

      <div>
        <label>Industry</label>
        <input {...register('industry')} />
        {errors.industry && <span>{errors.industry.message}</span>}
      </div>

      <div>
        <label>Size Range</label>
        <input {...register('sizeRange')} />
        {errors.sizeRange && <span>{errors.sizeRange.message}</span>}
      </div>

      <div>
        <label>Notes</label>
        <textarea {...register('notes')} />
        {errors.notes && <span>{errors.notes.message}</span>}
      </div>

      <button className="btn" type="submit">
        Submit
      </button>
    </form>
  );
}

export default CompanyForm;
