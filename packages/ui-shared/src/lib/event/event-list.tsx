import { EventReadDtoWithRelations } from '@contact-tracker/api-models';
import Link from 'next/link';
import CompanyInfoCard from '../company/company-info-card';
import ContactInfoCard from '../contact/contact-info-card';
import RoleInfoCard from '../role/role-info-card';
import { EventTypeInfoCard } from './event-type-info-card';
import FormattedDate from '../common/formatted-date';
import DirectionInfo from '../common/direction-info';

export interface EventListProps {
  events: EventReadDtoWithRelations[];
}

export function EventList(props: EventListProps) {
  return (
    <div className="mt-5 flex flex-wrap">
      {props.events && props.events.length ? (
        <>
          {props.events.map((event: EventReadDtoWithRelations) => (
            <div
              className="card bg-neutral text-neutral-content w-64 shadow-sm mb-3 mr-3"
              key={event.id}
            >
              <div className="card-body">
                {event.direction && <DirectionInfo direction={event.direction} />}
                {event.company && <CompanyInfoCard company={event.company} renderFull={false} />}
                {event.contact && <ContactInfoCard contact={event.contact} renderFull={false} />}
                {event.role && <RoleInfoCard role={event.role} renderFull={false} />}
                {event.eventType && (
                  <EventTypeInfoCard eventType={event.eventType} renderFull={false} />
                )}
                <ul>
                  <li>
                    <FormattedDate dateValue={event.occurredAt} />
                  </li>
                  <li>
                    {event.summary && <span>Summary: </span>}
                    {event.summary}
                  </li>
                  <li>
                    {event.details && <span>Details: </span>}
                    {event.details}
                  </li>
                  <li>
                    {event.source && <span>Source: </span>}
                    {event.source}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>No events found!</p>
      )}
    </div>
  );
}

export default EventList;
