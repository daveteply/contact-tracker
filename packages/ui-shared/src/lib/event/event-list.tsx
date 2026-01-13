import { EventReadDto } from '@contact-tracker/api-models';

export interface EventListProps {
  eventList: any;
}

export function EventList(props: EventListProps) {
  return (
    <div className="mt-5 flex flex-wrap">
      {props.eventList && props.eventList.length ? (
        <>
          {props.eventList.map((event: EventReadDto) => (
            <div
              className='className="card bg-neutral text-neutral-content w-64 shadow-sm mb-3 mr-3"'
              key={event.id}
            >
              <div className="card-body">
                <ul>
                  <li>{event.companyId}</li>
                  <li>{event.contactId}</li>
                  <li>{event.roleId}</li>
                  <li>{event.eventTypeId}</li>
                  {/* <li>{event.occurredAt}</li> */}
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
