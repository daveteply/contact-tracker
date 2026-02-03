'use client';

import { useEffect } from 'react';
import { Controller, DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventCreateSchema, EventUpdateSchema } from '@contact-tracker/validation';
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

interface EventFormProps<T extends FieldValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  onSearchCompany: (query: string) => Promise<CompanyReadDto[]>;
  onSearchContact: (query: string) => Promise<ContactReadDto[]>;
  onSearchRole: (query: string) => Promise<RoleReadDto[]>;
  onFetchEventTypes: () => Promise<EventTypeReadDto[]>;
}

export function EventForm<T extends FieldValues>({
  onSubmitAction,
  initialData,
  isEdit = false,
  onSearchCompany,
  onSearchContact,
  onSearchRole,
  onFetchEventTypes,
}: EventFormProps<T>) {
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? EventUpdateSchema : EventCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: initialData,
    mode: 'onChange',
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: T) => {
    try {
      const result = await onSubmitAction(data);
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
    <div className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Event Type</legend>
          <Controller
            name={'eventTypeId' as Path<T>}
            control={control}
            render={({ field }) => (
              <EventTypeSelect
                value={field.value}
                onChange={field.onChange}
                onFetchEventTypes={onFetchEventTypes}
                // error={errors.eventTypeId?.message}
              />
            )}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Direction</legend>
          <EnumSelector
            register={register('direction' as Path<T>)}
            enumObject={DirectionType}
            useButtons={true}
          />
          <ErrorMsg name={'direction' as Path<T>} />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Source</legend>
          <EnumSelector register={register('source' as Path<T>)} enumObject={SourceType} />
          <ErrorMsg name={'source' as Path<T>} />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Company</legend>
          <CompanyCombobox
            control={control}
            name={'company' as Path<T>}
            onSearch={onSearchCompany}
          />
          <ErrorMsg name={'company' as Path<T>} />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Contact</legend>
          <ContactCombobox
            control={control}
            name={'contact' as Path<T>}
            onSearch={onSearchContact}
          />
          <ErrorMsg name={'firstName' as Path<T>} />
          <ErrorMsg name={'lastName' as Path<T>} />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Role</legend>
          <RoleCombobox control={control} name={'role' as Path<T>} onSearch={onSearchRole} />
          <ErrorMsg name={'title' as Path<T>} />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Date</legend>
          <input
            type="date"
            className="input"
            {...register('occurredAt' as Path<T>, { valueAsDate: true })}
          />
          <ErrorMsg name={'occurredAt' as Path<T>} />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Summary (optional)</legend>
          <input className="input" {...register('summary' as Path<T>)} />
          <ErrorMsg name={'summary' as Path<T>} />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Details (optional)</legend>
          <textarea className="textarea" {...register('details' as Path<T>)} />
          <ErrorMsg name={'details' as Path<T>} />
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
