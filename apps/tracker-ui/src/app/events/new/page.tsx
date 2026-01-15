import { createEventAction } from '@/lib/server/actions/event-actions';
import { searchCompanies } from '@/lib/server/clients/company-client';
import { EventForm } from '@contact-tracker/ui-shared';

export default async function Index() {
  return <EventForm onSubmitAction={createEventAction} onSearch={searchCompanies}></EventForm>;
}
