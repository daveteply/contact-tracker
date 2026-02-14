import { fetchEventById } from '@/lib/server/clients/events-client';
import {
  CompanyInfoCard,
  ContactInfoCard,
  EventTypeInfoCard,
  FormattedDate,
  RoleInfoCard,
} from '@contact-tracker/ui-components';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

import Link from 'next/link';

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = parseInt(id);
  const response = await fetchEventById(eventId, 'company,contact,role,eventtype');
  const event = response.data;

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Event Details</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${eventId}/edit`}
          title="Edit Event"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${eventId}/delete`}
          title="Delete Event"
        >
          <TrashIcon className="size-6" />
        </Link>
      </div>

      {event ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-1">
            {/* {event.direction && <DirectionInfo direction={event.direction} />} */}
            {event.direction}
            <span>on</span>
            <FormattedDate dateValue={event.occurredAt} useRelativeTime={false} />
          </div>
          <p>
            {event.source && <span>Source: </span>}
            {event.source}
          </p>

          {event.company && <CompanyInfoCard company={event.company} />}
          {event.contact && <ContactInfoCard contact={event.contact} />}
          {event.role && <RoleInfoCard role={event.role} />}
          {event.eventType && <EventTypeInfoCard eventType={event.eventType} />}
          <ul>
            <li>
              {event.summary && <span>Summary: </span>}
              {event.summary}
            </li>
            <li>
              {event.details && <span>Details: </span>}
              {event.details}
            </li>
            <li></li>
          </ul>
        </div>
      ) : (
        <div>Event Not Found</div>
      )}
    </>
  );
}
