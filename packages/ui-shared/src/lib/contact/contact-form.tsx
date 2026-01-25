'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactInput, ContactInputSchema } from '@contact-tracker/validation';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
  onSubmitAction: (data: ContactInput) => Promise<{ success: boolean; message: string }>;
  initialData?: ContactInput;
  isEdit?: boolean;
}

export function ContactForm({ onSubmitAction, initialData, isEdit = false }: ContactFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactInputSchema),
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ContactInput) => {
    try {
      const result = await onSubmitAction(data);
      if (result.success) {
        showToast(`Contact ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push('/events/contacts');
      } else {
        // TODO log this
        showToast('Could not save Contact', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">First Name</legend>
        <input className="input" {...register('firstName')} required />
        <p className="label">Required</p>
        <p className="text-red-600">
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Last Name</legend>
        <input className="input" {...register('lastName')} required />
        <p className="label">Required</p>
        <p className="text-red-600">{errors.lastName && <span>{errors.lastName.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Title</legend>
        <input className="input" {...register('title')} />
        <p className="text-red-600">{errors.title && <span>{errors.title.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input className="input" {...register('email')} />
        <p className="text-red-600">{errors.email && <span>{errors.email.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Phone</legend>
        <input className="input" {...register('phoneNumber')} />
        <p className="text-red-600">
          {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">LinkedIn URL</legend>
        <input className="input" {...register('linkedInUrl')} />
        <p className="text-red-600">
          {errors.linkedInUrl && <span>{errors.linkedInUrl.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Is this a recruiter from the Company?</legend>
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className={`checkbox ${errors.isPrimaryRecruiter ? 'checkbox-error' : 'checkbox-primary'}`}
            {...register('isPrimaryRecruiter')}
          />
          <span className="label-text">Yes, this is the primary recruiter</span>
        </label>

        {errors.isPrimaryRecruiter && (
          <p className="fieldset-label text-error">{errors.isPrimaryRecruiter.message}</p>
        )}
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

export default ContactForm;
