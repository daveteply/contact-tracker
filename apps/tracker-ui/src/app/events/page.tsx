import { EventList } from '@contact-tracker/ui-shared';
import { fetchEvents } from '@/lib/server/clients/events-client';
import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

export default async function EventsPage() {
  const events = await fetchEvents(undefined, undefined, 'company,contact,role,eventtype');

  return (
    <>
      <div className="flex mb-3 justify-between">
        <h1 className="text-xl pr-1">Events</h1>
        <Link className="btn btn-sm text-primary" href="events/new" title="Add Event">
          <PlusCircleIcon className="size-5" />
          Add Event
        </Link>
      </div>

      <EventList events={events} />
    </>
  );
}
