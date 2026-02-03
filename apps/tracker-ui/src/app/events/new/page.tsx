import { createEventAction } from '@/lib/server/actions/event-actions';
import { searchCompanies } from '@/lib/server/clients/companies-client';
import { searchContacts } from '@/lib/server/clients/contacts-client';
import { fetchEventTypes } from '@/lib/server/clients/event-types-client';
import { searchRoles } from '@/lib/server/clients/roles-client';
import { DirectionType } from '@contact-tracker/api-models';
import { EventForm } from '@contact-tracker/ui-shared';
import { EventCreate, EventFormValues } from '@contact-tracker/validation';

export default async function EventsNewPage() {
  const newEventDefaults: EventFormValues = {
    occurredAt: new Date().toISOString().split('T')[0],
    direction: DirectionType.Outbound,
    source: null,

    // Set these to null/undefined to bypass SelectionSchema refinements
    eventTypeId: null,
    company: null,
    contact: null,
    role: null,

    summary: '',
    details: '',
  };

  return (
    <>
      <h1 className="text-xl">Events - new Event</h1>
      <p className="mb-5 italic">Note: most fields are required</p>

      <EventForm<EventFormValues, EventCreate>
        initialData={newEventDefaults}
        onSubmitAction={createEventAction}
        onSearchCompany={searchCompanies}
        onSearchContact={searchContacts}
        onSearchRole={searchRoles}
        onFetchEventTypes={fetchEventTypes}
      ></EventForm>
    </>
  );
}
