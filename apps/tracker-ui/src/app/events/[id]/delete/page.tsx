import { deleteEvent, fetchEventById } from '@/lib/server/clients/events-client';
import { EntityDelete, EventInfoCard } from '@contact-tracker/ui-shared';

export default async function DeleteEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = parseInt(id);

  const result = await fetchEventById(eventId, 'company,contact,role,eventtype');
  const event = result.data;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl pr-1">Event - Delete</h1>
      {event ? (
        <>
          <EventInfoCard event={event} showControls={false} />
          <EntityDelete
            id={event.id}
            entityName="event"
            postActionRoute="/events"
            onDeleteAction={deleteEvent}
          />
        </>
      ) : (
        <div>Company Not Found</div>
      )}
    </div>
  );
}
