import { EventForm } from '@contact-tracker/ui-shared';

export default async function Index({ id }: { id: number }) {
  return <EventForm mode="edit" id={id}></EventForm>;
}
