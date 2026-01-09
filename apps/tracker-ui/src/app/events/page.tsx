import Link from 'next/link';
import { EventList } from '@contact-tracker/ui-shared';
import { fetchEvents } from '@/lib/server/clients/events-client';

export default async function Index() {
  const res = await fetchEvents();

  return (
    <div>
      <h2 className="text-xl mb-4">Events</h2>
      <Link className="btn" href="events/new">
        Add New Event
      </Link>

      <EventList eventList={res.data} />
    </div>
  );
}
