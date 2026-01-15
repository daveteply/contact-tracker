import { createEventAction } from '@/lib/server/actions/event-actions';
import { searchCompanies } from '@/lib/server/clients/company-client';
import { searchContacts } from '@/lib/server/clients/contacts-client';
import { EventForm } from '@contact-tracker/ui-shared';

export default async function Index() {
  return (
    <EventForm
      onSubmitAction={createEventAction}
      onSearchCompany={searchCompanies}
      onSearchContact={searchContacts}
    ></EventForm>
  );
}
