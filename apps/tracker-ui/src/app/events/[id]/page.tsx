import { fetchEventById } from '@/lib/server/clients/events-client';
import {
  CompanyInfoCard,
  ContactInfoCard,
  DirectionInfo,
  EventTypeInfoCard,
  FormattedDate,
  RoleInfoCard,
} from '@contact-tracker/ui-shared';

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = parseInt(id);
  const response = await fetchEventById(eventId, 'company,contact,role,eventtype');
  const event = response.data;

  return (
    <>
      <h1 className="text-xl mb-4">Event Details</h1>
      {event ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-1">
            {event.direction && <DirectionInfo direction={event.direction} />}
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
