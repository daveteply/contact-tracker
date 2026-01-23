import { createEventAction } from '@/lib/server/actions/event-actions';
import { searchCompanies } from '@/lib/server/clients/company-client';
import { searchContacts } from '@/lib/server/clients/contacts-client';
import { fetchEventTypes } from '@/lib/server/clients/event-types-client';
import { searchRoles } from '@/lib/server/clients/role-client';
import { DirectionType } from '@contact-tracker/api-models';
import { EventForm } from '@contact-tracker/ui-shared';
import { EventFormValues } from '@contact-tracker/validation';

export default async function EventsNewPage() {
  const getNewEventDefaults = (): EventFormValues => ({
    occurredAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    direction: DirectionType.Outbound,
    source: '',
    company: { name: '', isNew: true },
    contact: { firstName: '', lastName: '', isNew: true },
    role: { title: '', isNew: true },
    eventTypeId: 0,
  });

  return (
    <>
      <h1 className="text-xl">Events - new Event</h1>
      <p className="mb-5 italic">Note: most fields are required</p>

      <EventForm
        initialData={getNewEventDefaults()}
        onSubmitAction={createEventAction}
        onSearchCompany={searchCompanies}
        onSearchContact={searchContacts}
        onSearchRole={searchRoles}
        onFetchEventTypes={fetchEventTypes}
      ></EventForm>
    </>
  );
}
