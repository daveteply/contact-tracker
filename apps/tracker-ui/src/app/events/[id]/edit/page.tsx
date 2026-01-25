import { updateEventAction } from '@/lib/server/actions/event-actions';
import { searchCompanies } from '@/lib/server/clients/companies-client';
import { searchContacts } from '@/lib/server/clients/contacts-client';
import { fetchEventTypes } from '@/lib/server/clients/event-types-client';
import { fetchEventById } from '@/lib/server/clients/events-client';
import { searchRoles } from '@/lib/server/clients/roles-client';

import { EventForm } from '@contact-tracker/ui-shared';
import { mapEventDtoToFormValues } from '@contact-tracker/validation';

export default async function EventUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = parseInt(id);
  const response = await fetchEventById(eventId, 'company,contact,role,eventtype');

  if (!response.data) {
    return <div>Event not found</div>;
  }

  // Transform the data here before passing it to the client component
  const initialData = mapEventDtoToFormValues(response.data);

  const boundUpdateAction = updateEventAction.bind(null, eventId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <EventForm
        initialData={initialData}
        isEdit={true}
        onSubmitAction={boundUpdateAction}
        onSearchCompany={searchCompanies}
        onSearchContact={searchContacts}
        onSearchRole={searchRoles}
        onFetchEventTypes={fetchEventTypes}
      />
    </div>
  );
}
