'use client';

import { ContactReadDto } from '@contact-tracker/api-models';
import ExternalLink, { ExternalLinkType } from '../common/external-link';

export interface ContactCardProps {
  contact: ContactReadDto;
  renderFull?: boolean;
}

export function ContactInfoCard({ contact, renderFull = true }: ContactCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {renderFull ? (
          <>
            <h2 className="card-title">
              {contact.firstName} {contact.lastName}
            </h2>
            <h2>{contact.title}</h2>
            <ul>
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
