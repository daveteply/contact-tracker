'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventFormValues, EventInput, EventInputSchema } from '@contact-tracker/validation';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';
import { DirectionType, SourceType } from '@contact-tracker/api-models';

interface EventFormProps {
  onSubmitAction: (data: EventInput) => Promise<{ success: boolean; message: string }>;
  initialData?: EventFormValues;
  isEdit?: boolean;
}

export function EventForm({ onSubmitAction, initialData, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(EventInputSchema),
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: EventFormValues) => {
    try {
      console.log(1111, data);
      const result = await onSubmitAction(data as EventInput);
      if (result.success) {
        showToast(`Event ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push('/events');
      } else {
        // TODO log this
        showToast('Could not save Event', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company</legend>
        <input className="input" {...register('companyId', { valueAsNumber: true })} value={96} />
        <p className="text-red-600">
          {errors.companyId && <span>{errors.companyId.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Contact</legend>
        <input className="input" {...register('contactId', { valueAsNumber: true })} value={1} />
        <p className="text-red-600">
          {errors.contactId && <span>{errors.contactId.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Role</legend>
        <input className="input" {...register('roleId', { valueAsNumber: true })} value={2} />
        <p className="text-red-600">{errors.roleId && <span>{errors.roleId.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Event Type</legend>
        <input className="input" {...register('eventTypeId', { valueAsNumber: true })} value={1} />
        <p className="text-red-600">
          {errors.eventTypeId && <span>{errors.eventTypeId.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Occurred At</legend>
        <input
          className="input"
          {...register('occurredAt', { valueAsDate: true })}
          value={'1/12/2026'}
        />
        <p className="text-red-600">
          {errors.occurredAt && <span>{errors.occurredAt.message}</span>}
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Summary</legend>
        <input className="input" {...register('summary')} />
        <p className="label">Required</p>
        <p className="text-red-600">{errors.summary && <span>{errors.summary.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Details</legend>
        <textarea className="textarea" {...register('details')} />
        <p className="text-red-600">{errors.details && <span>{errors.details.message}</span>}</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Source</legend>
        <select className="select" {...register('source', { valueAsNumber: true })}>
          <option value={SourceType.Email}>Email</option>
          <option value={SourceType.LinkedIn}>LinkedIn</option>
          <option value={SourceType.Website}>Website</option>
          <option value={SourceType.Recruiter}>Recruiter</option>
          <option value={SourceType.Referral}>Referral</option>
        </select>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Source</legend>
        <select className="select" {...register('direction', { valueAsNumber: true })}>
          <option value={DirectionType.Inbound}>Inbound</option>
          <option value={DirectionType.Outbound}>Outbound</option>
        </select>
      </fieldset>

      <button className="btn mt-4" type="submit" disabled={isSubmitting}>
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  );
}

export default EventForm;
