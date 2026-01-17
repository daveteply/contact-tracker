import { EventReadDtoWithRelations } from '@contact-tracker/api-models';

export interface EventListProps {
  eventList: EventReadDtoWithRelations[];
}

export function EventList(props: EventListProps) {
  return (
    <div className="mt-5 flex flex-wrap">
      {props.eventList && props.eventList.length ? (
        <>
          {props.eventList.map((event: EventReadDtoWithRelations) => (
            <div
              className="card bg-neutral text-neutral-content w-64 shadow-sm mb-3 mr-3"
              key={event.id}
            >
              <div className="card-body">
                <ul>
                  <li>
                    <div className="card card-xs">
                      <div className="card-body">
                        <h2 className="card-title">{event.company?.name}</h2>
                      </div>
                      <ul>
                        <li>
                          <a href={event.company?.website}>{event.company?.website}</a>
                        </li>
                        <li>{event.company?.industry}</li>
                        <li>{event.company?.sizeRange}</li>
                        <li>{event.company?.notes}</li>
                      </ul>
                    </div>
                  </li>

                  <li>
                    <div className="card card-xs">
                      <div className="card-body">
                        <h2 className="card-title">
                          {event.contact?.firstName} {event.contact?.lastName}
                        </h2>
                        <h3>{event.contact?.title}</h3>
                      </div>
                      <ul>
                        <li>
                          <a href={`mailto:${event.contact?.email}`}>{event.contact?.email}</a>
                        </li>
                        <li>{event.contact?.linkedInUrl}</li>
                        <li>{event.contact?.phoneNumber}</li>
                        <li>{event.contact?.notes}</li>
                      </ul>
                    </div>
                  </li>

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
