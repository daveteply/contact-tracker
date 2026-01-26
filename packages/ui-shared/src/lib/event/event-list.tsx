import { EventReadDtoWithRelations } from '@contact-tracker/api-models';
import EventInfoCard from './event-info-card';

export interface EventListProps {
  events: EventReadDtoWithRelations[];
}

export function EventList(props: EventListProps) {
  return (
    <div className="flex flex-wrap">
      {props.events && props.events.length ? (
        <>
          {props.events.map((event: EventReadDtoWithRelations) => (
            <EventInfoCard key={event.id} event={event} />
          ))}
        </>
      ) : (
        <p>No events found!</p>
      )}
    </div>
  );
}

export default EventList;
