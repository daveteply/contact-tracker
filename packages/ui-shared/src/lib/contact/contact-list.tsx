'use client';

import { ContactReadDto } from '@contact-tracker/api-models';
import ContactInfoCard from './contact-info-card';

export interface ContactListProps {
  contacts: ContactReadDto[];
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <div className="flex flex-col gap-3">
      {contacts && contacts.length ? (
        <>
          {contacts.map((Contact: ContactReadDto) => (
            <ContactInfoCard key={Contact.id} contact={Contact} />
          ))}
        </>
      ) : (
        <p>No Contacts found</p>
      )}
    </div>
  );
}

export default ContactList;
