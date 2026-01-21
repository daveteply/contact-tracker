import { EventList } from '@contact-tracker/ui-shared';
import { fetchEvents } from '@/lib/server/clients/events-client';
import Link from 'next/link';

export default async function Index() {
  const events = await fetchEvents(undefined, undefined, 'company,contact,role');

  return (
    <div>
      <h1 className="text-xl mb-4">Events</h1>
      <Link className="btn" href="events/new">
        Add New Event
      </Link>

      <EventList events={events} />
    </div>
  );
}
