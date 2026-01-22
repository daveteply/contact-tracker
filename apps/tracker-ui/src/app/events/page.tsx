import { EventList } from '@contact-tracker/ui-shared';
import { fetchEvents } from '@/lib/server/clients/events-client';
import Link from 'next/link';

export default async function Index() {
  const events = await fetchEvents(undefined, undefined, 'company,contact,role,eventtype');

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-1">Events</h1>
        <Link className="btn btn-circle btn-sm" href="events/new" title="Add new Event">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <EventList events={events} />
    </>
  );
}
