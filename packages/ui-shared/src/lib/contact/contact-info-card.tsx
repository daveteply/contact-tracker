'use client';

import { ContactReadDto } from '@contact-tracker/api-models';
import ExternalLink, { ExternalLinkType } from '../common/external-link';
import Link from 'next/link';

export interface ContactCardProps {
  contact: ContactReadDto;
  renderFull?: boolean;
  showControls?: boolean;
}

export function ContactInfoCard({
  contact,
  renderFull = true,
  showControls = true,
}: ContactCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {renderFull ? (
          <>
            <div className="flex justify-between">
              <div className="flex justify-center items-center">
                <h2 className="card-title mr-2">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.isPrimaryRecruiter && <span className="text-sm">(Primary Recruiter)</span>}
              </div>
              {showControls && (
                <div className="flex gap-1">
                  <Link href={`/events/contacts/${contact.id}/edit`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                  </Link>
                  <Link href={`/events/contacts/${contact.id}/delete`} className="text-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
            <h2>{contact.title}</h2>
            <ul>
              <li className="truncate">{contact.company?.name}</li>
              <li>
                <ExternalLink
                  url={contact.email}
                  linkType={ExternalLinkType.Email}
                  iconOnly={!renderFull}
                />
              </li>
              <li>
                <ExternalLink
                  url={contact.phoneNumber}
                  linkType={ExternalLinkType.Phone}
                  iconOnly={!renderFull}
                />
              </li>
              <li>
                <ExternalLink url={contact.linkedInUrl} iconOnly={!renderFull} />
              </li>
              <li>{contact.isPrimaryRecruiter}</li>
              <li>{contact.notes}</li>
            </ul>
          </>
        ) : (
          <div className="flex">
            <h2 className="card-title  pr-1">
              {contact.firstName} {contact.lastName}
            </h2>
            <ExternalLink
              url={contact.email}
              linkType={ExternalLinkType.Email}
              iconOnly={!renderFull}
            />
            <ExternalLink
              url={contact.phoneNumber}
              linkType={ExternalLinkType.Phone}
              iconOnly={!renderFull}
            />
            <ExternalLink url={contact.linkedInUrl} iconOnly={!renderFull} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactInfoCard;
