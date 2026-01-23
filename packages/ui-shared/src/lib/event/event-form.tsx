'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { EnumSelector } from '../common/enum-selector';

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
    mode: 'onChange',
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
    <div className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Event Type</legend>
          <Controller
            name="eventTypeId"
            control={control}
            render={({ field }) => (
              <EventTypeSelect
                value={field.value}
                onChange={field.onChange}
                onFetchEventTypes={onFetchEventTypes}
                error={errors.eventTypeId?.message}
                required
              />
            )}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Direction</legend>
          <EnumSelector
            register={register('direction')}
            enumObject={DirectionType}
            useButtons={true}
            required
            defaultVale={DirectionType.Outbound}
          />
          <p className="text-red-600">
            {errors.direction && <span>{errors.direction.message}</span>}
          </p>
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Source</legend>
          <EnumSelector register={register('source')} enumObject={SourceType} required />
          <p className="text-red-600">{errors.source && <span>{errors.source.message}</span>}</p>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Company</legend>
          <CompanyCombobox control={control} name="company" onSearch={onSearchCompany} required />
          {errors.company?.name && <p className="text-red-600">{errors.company.name.message}</p>}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Contact</legend>
          <ContactCombobox control={control} name="contact" onSearch={onSearchContact} required />
          {errors.contact?.firstName && (
            <p className="text-red-600">{errors.contact.firstName.message}</p>
          )}
          {errors.contact?.lastName && (
            <p className="text-red-600">{errors.contact.lastName.message}</p>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Role</legend>
          <RoleCombobox control={control} name="role" onSearch={onSearchRole} required />
          {errors.role?.title && <p className="text-red-600">{errors.role.title.message}</p>}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Date</legend>
          <input type="date" className="input" {...register('occurredAt', { valueAsDate: true })} />
          <p className="text-red-600">
            {errors.occurredAt && <span>{errors.occurredAt.message}</span>}
          </p>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Summary (optional)</legend>
          <input className="input" {...register('summary')} />
          <p className="text-red-600">{errors.summary && <span>{errors.summary.message}</span>}</p>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Details (optional)</legend>
          <textarea className="textarea" {...register('details')} />
          <p className="text-red-600">{errors.details && <span>{errors.details.message}</span>}</p>
        </fieldset>

        <div className="mt-4">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isEdit ? 'Update' : 'Create'}
          </button>
          <button className="btn ml-3" onClick={() => router.push('/events')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
