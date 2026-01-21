import { EventReadDtoWithRelations } from '@contact-tracker/api-models';
import Link from 'next/link';
import CompanyInfoCard from '../company/company-info-card';
import ContactInfoCard from '../contact/contact-info-card';
import RoleInfoCard from '../role/role-info-card';

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
                {event.company && <CompanyInfoCard company={event.company} />}
                {event.contact && <ContactInfoCard contact={event.contact} />}
                {event.role && <RoleInfoCard role={event.role} />}
                <ul>
                  <li>{event.roleId}</li>
                  <li>{event.eventTypeId}</li>
                  {/* {<li>{event.occurredAt.toDateString()}</li>} */}
                  <li>{event.summary}</li>
                  <li>{event.details}</li>
                  <li>{event.source}</li>
                  <li>{event.direction}</li>
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
