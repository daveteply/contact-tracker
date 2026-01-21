'use client';

import { ContactReadDto } from '@contact-tracker/api-models';
import ExternalLink, { ExternalLinkType } from '../common/external-link';

export interface ContactCardProps {
  contact: ContactReadDto;
}

export function ContactInfoCard({ contact }: ContactCardProps) {
  return (
    <div className="card w-50 bg-base-100 card-sm shadow-sm">
      <div className="card-body">
        <h2 className="card-title">
          {contact.firstName} {contact.lastName}
        </h2>
        <h2>{contact.title}</h2>
        <ul>
          <li>
            <ExternalLink url={contact.email} linkType={ExternalLinkType.Email} />
          </li>
          <li>
            <ExternalLink url={contact.phoneNumber} linkType={ExternalLinkType.Phone} />{' '}
          </li>
          <li>
            <ExternalLink url={contact.linkedInUrl} />
          </li>
          <li>{contact.isPrimaryRecruiter}</li>
          <li>{contact.notes}</li>
        </ul>
      </div>
    </div>
  );
}

export default ContactInfoCard;
