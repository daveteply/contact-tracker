import { fetchContacts } from '@/lib/server/clients/contacts-client';
import { ContactList } from '@contact-tracker/ui-shared';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function Index() {
  const contacts = await fetchContacts();

  return (
    <>
      <div className="flex mb-3 justify-between">
        <h1 className="text-xl pr-1">Contacts</h1>
        <Link className="btn btn-sm text-primary" href="contacts/new" title="Add Contact">
          <PlusCircleIcon className="size-5" />
          Add Contact
        </Link>
      </div>
      <ContactList contacts={contacts} />
    </>
  );
}
