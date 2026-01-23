'use client';

import { DirectionType, EventReadDtoWithRelations } from '@contact-tracker/api-models';
import FormattedDate from '../common/formatted-date';
import DirectionInfo from '../common/direction-info';
import EventActionMenu from './event-action-menu';
import Link from 'next/link';

export interface EventInfoCardProps {
  event: EventReadDtoWithRelations;
  showControls?: boolean;
}

export function EventInfoCard({ event, showControls = true }: EventInfoCardProps) {
  return (
    <div className="relative card bg-neutral text-neutral-content w-full shadow-sm mb-3 mr-3">
      {/* The invisible primary link */}
      <Link
        href={`/events/${event.id}`}
        className="absolute inset-0 z-10"
        aria-label="Go to Event Details page"
      />

      <div className="relative card-body">
        <div className="card-title flex justify-between">
          <div>{event.eventType?.name}</div>
          <div className="flex items-center">
            <div className="text-sm capitalize">
              <FormattedDate dateValue={event.occurredAt} />
            </div>
            {showControls && (
              <div className="relative z-20">
                <EventActionMenu id={event.id} />
              </div>
            )}
          </div>
        </div>
        <ul>
          <li>{event.company?.name}</li>
          <li>{event.role?.title}</li>
        </ul>
        <div className="flex">
          <DirectionInfo direction={event.direction} />
          {event.direction === DirectionType.Inbound ? ' from ' : ' to '}
          {event.contact?.firstName} {event.contact?.lastName}
        </div>
      </div>
    </div>
  );
}

export default EventInfoCard;
