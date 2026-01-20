import { EventReadDtoWithRelations } from '@contact-tracker/api-models';
import Link from 'next/link';
import CompanyInfoCard from '../company/company-info-card';
import ContactInfoCard from '../contact/contact-info-card';

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
                {event.company && <CompanyInfoCard company={event.company}></CompanyInfoCard>}
                {event.contact && <ContactInfoCard contact={event.contact}></ContactInfoCard>}
                <ul>
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
                          <a
                            className="flex"
                            href={`mailto:${event.contact?.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.contact?.email}
                            {event.contact?.email && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-4 pl-1"
                              >
                                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                              </svg>
                            )}
                          </a>
                        </li>
                        <li>
                          <a
                            className="flex"
                            href={`${event.contact?.linkedInUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.contact?.linkedInUrl}
                            {event.contact?.linkedInUrl && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-4 pl-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                              </svg>
                            )}
                          </a>
                        </li>
                        <li>
                          <a className="flex" href={`tel:${event.contact?.phoneNumber}`}>
                            {event.contact?.phoneNumber}
                            {event.contact?.phoneNumber && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-4 pl-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </a>
                        </li>
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
