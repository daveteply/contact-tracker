export interface EventListProps {
  eventList: any;
}

export default function EventList(props: EventListProps) {
  return (
    <>
      {props.eventList && props.eventList ? (
        <ul>
          {props.eventList.map((event: any) => (
            <li key={event.id}>
              {event.firstName} {event.lastName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found</p>
      )}
    </>
  );
}
