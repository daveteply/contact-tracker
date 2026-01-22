import { createEventAction } from '@/lib/server/actions/event-actions';
import { searchCompanies } from '@/lib/server/clients/company-client';
import { searchContacts } from '@/lib/server/clients/contacts-client';
import { fetchEventTypes } from '@/lib/server/clients/event-types-client';
import { searchRoles } from '@/lib/server/clients/role-client';
import { EventForm } from '@contact-tracker/ui-shared';

export default async function EventsNewPage() {
  return (
    <>
      <h1 className="text-xl">Events - new Event</h1>
      <p className="mb-5 italic">Note: most fields are required</p>

      <EventForm
        onSubmitAction={createEventAction}
        onSearchCompany={searchCompanies}
        onSearchContact={searchContacts}
        onSearchRole={searchRoles}
        onFetchEventTypes={fetchEventTypes}
      ></EventForm>
    </>
  );
}
