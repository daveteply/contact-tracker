import { createEventAction } from '@/lib/server/actions/event-actions';
import { EventForm } from '@contact-tracker/ui-shared';

export default async function Index() {
  return <EventForm onSubmitAction={createEventAction}></EventForm>;
}
