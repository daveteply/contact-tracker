'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventFormValues, EventInput, EventInputSchema } from '@contact-tracker/validation';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';
import {
  CompanyReadDto,
  ContactReadDto,
  DirectionType,
  EventTypeReadDto,
  RoleReadDto,
  SourceType,
} from '@contact-tracker/api-models';
import CompanyCombobox from '../company/company-combobox';
import ContactCombobox from '../contact/contact-combobox';
import RoleCombobox from '../role/role-combobox';
import { EventTypeSelect } from './event-type-select';

interface EventFormProps {
  onSubmitAction: (data: EventInput) => Promise<{ success: boolean; message: string }>;
  initialData?: EventFormValues;
  isEdit?: boolean;
  onSearchCompany: (query: string) => Promise<CompanyReadDto[]>;
  onSearchContact: (query: string) => Promise<ContactReadDto[]>;
  onSearchRole: (query: string) => Promise<RoleReadDto[]>;
  onFetchEventTypes: () => Promise<EventTypeReadDto[]>;
}

export function EventForm({
  onSubmitAction,
  initialData,
  isEdit = false,
  onSearchCompany,
  onSearchContact,
  onSearchRole,
  onFetchEventTypes,
}: EventFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
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
        <CompanyCombobox control={control} name="company" onSearch={onSearchCompany} />
        {errors.company?.name && <p className="text-red-600">{errors.company.name.message}</p>}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Contact</legend>
        <ContactCombobox control={control} name="contact" onSearch={onSearchContact} />
        {errors.contact?.firstName && (
          <p className="text-red-600">{errors.contact.firstName.message}</p>
        )}
        {errors.contact?.lastName && (
          <p className="text-red-600">{errors.contact.lastName.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Role</legend>
        <RoleCombobox control={control} name="role" onSearch={onSearchRole} />
        {errors.role?.title && <p className="text-red-600">{errors.role.title.message}</p>}
      </fieldset>

      <EventTypeSelect
        label="Event Type"
        register={register('eventTypeId', { valueAsNumber: true })}
        onFetchEventTypes={onFetchEventTypes}
        error={errors.eventTypeId?.message}
      />

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
